import {
  Interaction,
  Client,
  ChannelType,
  PermissionsBitField,
  CategoryChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonInteraction,
  ModalSubmitInteraction,
  GuildMember,
  GuildTextBasedChannel,
} from 'discord.js';
import { api } from '../lib/api';
import { TICKET_CATEGORIES } from '@lomall/shared';

const cooldowns = new Map<string, number>();

export async function handleInteraction(interaction: Interaction, client: Client) {
  if (interaction.isChatInputCommand()) {
    await handleSlashCommand(interaction, client);
  } else if (interaction.isButton()) {
    await handleButton(interaction, client);
  } else if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction, client);
  }
}

/* ─── Slash Commands ─────────────────────────────────────── */

async function handleSlashCommand(interaction: any, client: Client) {
  const { commandName, guild } = interaction;
  const subcommand = interaction.options.getSubcommand(false);

  if (!guild) {
    await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    return;
  }

  switch (commandName) {
    case 'lomall':
      await handleLomallCommands(interaction, subcommand);
      break;
    case 'ticket':
      await handleTicketCommands(interaction, subcommand, client);
      break;
  }
}

/* ─── /lomall * ──────────────────────────────────────────── */

async function handleLomallCommands(interaction: any, sub: string | null) {
  switch (sub) {
    case 'setup': return handleSetup(interaction);
    case 'dashboard': return handleDashboard(interaction);
    case 'config': return handleConfig(interaction);
  }
}

async function handleSetup(interaction: any) {
  const guild = interaction.guild;
  await interaction.deferReply({ ephemeral: true });

  try {
    await api.post(`/guilds/${guild.id}/setup`, {
      name: guild.name,
      icon: guild.iconURL(),
    });

    let category = guild.channels.cache.find(
      (ch: any) => ch.type === ChannelType.GuildCategory && ch.name.toLowerCase() === 'tickets',
    ) as CategoryChannel | undefined;

    if (!category) {
      category = await guild.channels.create({
        name: 'Tickets',
        type: ChannelType.GuildCategory,
      });
    }

    const webUrl = process.env.WEB_URL || 'http://localhost:3000';

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('✅ Lomall Setup Complete')
      .setDescription('Your server is now ready for ticket management.')
      .addFields(
        { name: 'Tickets Category', value: category ? `#${category.name}` : 'Not created', inline: true },
        { name: 'Dashboard', value: `[Open Dashboard](${webUrl}/login)`, inline: true },
        { name: 'Next Step', value: 'Use `/ticket panel` to place a Create Ticket button in any channel', inline: false },
      );

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Setup failed: ${error.response?.data?.message || error.message}`,
    });
  }
}

async function handleDashboard(interaction: any) {
  const webUrl = process.env.WEB_URL || 'http://localhost:3000';
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('🌐 Lomall Dashboard')
    .setDescription(`Access your dashboard to manage tickets.\n\n[**Open Dashboard**](${webUrl}/login)`)
    .setFooter({ text: 'Sign in with Discord to continue' });
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleConfig(interaction: any) {
  const guild = interaction.guild;
  const setting = interaction.options.getString('setting');
  const value = interaction.options.getString('value');

  if (setting && value !== null) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const parsed: any = {};
      if (setting === 'sla') parsed.sla = parseInt(value, 10);
      else if (setting === 'autoClose') parsed.autoClose = value === 'true' || value === 'yes';
      else if (setting === 'autoCloseHours') parsed.autoCloseHours = parseInt(value, 10);

      await api.put(`/guilds/${guild.id}/settings`, parsed);
      await interaction.editReply({ content: `✅ \`${setting}\` has been updated.` });
    } catch (error: any) {
      await interaction.editReply({
        content: `❌ Failed to update: ${error.response?.data?.message || error.message}`,
      });
    }
    return;
  }

  await interaction.deferReply({ ephemeral: true });
  try {
    const res = await api.get(`/guilds/${guild.id}`);
    const settings = res.data.settings || {};
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`⚙️ ${guild.name} Configuration`)
      .addFields(
        { name: 'SLA (hours)', value: `\`${settings.sla ?? 24}\``, inline: true },
        { name: 'Auto-close', value: `\`${settings.autoClose !== false ? 'Enabled' : 'Disabled'}\``, inline: true },
        { name: 'Auto-close (hours)', value: `\`${settings.autoCloseHours ?? 48}\``, inline: true },
      )
      .setFooter({ text: 'Use /lomall config <setting> <value> to update' });
    await interaction.editReply({ embeds: [embed] });
  } catch {
    await interaction.editReply({ content: '❌ Fetch failed. Did you run `/lomall setup` first?' });
  }
}

/* ─── /ticket * ──────────────────────────────────────────── */

async function handleTicketCommands(interaction: any, sub: string | null, client: Client) {
  switch (sub) {
    case 'create': return handleTicketCreate(interaction);
    case 'panel': return handleTicketPanel(interaction);
    case 'list': return handleTicketList(interaction);
    case 'close': return handleTicketCloseCmd(interaction);
    case 'info': return handleTicketInfo(interaction);
  }
}

async function handleTicketPanel(interaction: any) {
  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle('🎫 Create a Ticket')
    .setDescription('Need help? Click the button below to create a support ticket.\n\nA private channel will be created for you and our support team.')
    .addFields(
      { name: 'Categories', value: TICKET_CATEGORIES.map((c) => `• ${c}`).join('\n'), inline: true },
      { name: 'Response Time', value: 'Our team typically responds within 24 hours.', inline: true },
    )
    .setFooter({ text: 'Only you and staff can see your ticket channel' });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('create_ticket')
      .setLabel('Create Ticket')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🎫'),
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleTicketCreate(interaction: any) {
  const subject = interaction.options.getString('subject', true);
  const category = interaction.options.getString('category') || 'general';

  if (!checkCooldown(interaction.user.id)) {
    return interaction.reply({ content: '⏳ Please wait before creating another ticket.', ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const result = await createTicketChannel(interaction, subject, category);
    await notifyStaff(interaction, result.channel, subject);
    await interaction.editReply({ content: `✅ Ticket created! Check ${result.channel}` });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Failed: ${error.response?.data?.message || error.message}`,
    });
  }
}

async function handleTicketList(interaction: any) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const res = await api.get('/tickets', { params: { guildId: interaction.guildId } });
    const tickets = res.data;

    if (!tickets.length) {
      return interaction.editReply({ content: '📭 No tickets found for this server.' });
    }

    const open = tickets.filter((t: any) => t.status === 'open');
    const resolved = tickets.filter((t: any) => t.status === 'resolved');
    const closed = tickets.filter((t: any) => t.status === 'closed');

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📋 Tickets — ${interaction.guild.name}`)
      .addFields(
        { name: '🟢 Open', value: `${open.length}`, inline: true },
        { name: '🟡 Resolved', value: `${resolved.length}`, inline: true },
        { name: '⚫ Closed', value: `${closed.length}`, inline: true },
      )
      .setFooter({ text: 'Use /ticket info for details on a specific ticket' });

    if (open.length > 0) {
      const recent = open.slice(0, 5).map((t: any) =>
        `• **${t.subject}** — <#${t.channelId}>`,
      ).join('\n');
      embed.addFields({ name: 'Recent Open Tickets', value: recent || 'None' });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    await interaction.editReply({ content: `❌ Failed to list tickets: ${error.message}` });
  }
}

async function handleTicketCloseCmd(interaction: any) {
  const channelId = interaction.options.getString('channel') || interaction.channelId;

  await interaction.deferReply({ ephemeral: true });

  try {
    const res = await api.get(`/tickets/channel/${channelId}`);
    const ticket = res.data;

    if (!ticket) {
      return interaction.editReply({ content: '❌ No ticket found for that channel.' });
    }

    await api.patch(`/tickets/${ticket.id}/close`);
    await interaction.editReply({ content: `✅ Ticket **${ticket.subject}** has been closed.` });

    const chan = interaction.guild.channels.cache.get(channelId) as GuildTextBasedChannel | undefined;
    if (chan?.isTextBased()) {
      await chan.send('🔒 This ticket has been closed by a staff member.');
      setTimeout(async () => { try { await chan.delete(); } catch { } }, 5000);
    }
  } catch (error: any) {
    await interaction.editReply({ content: `❌ Failed: ${error.response?.data?.message || error.message}` });
  }
}

async function handleTicketInfo(interaction: any) {
  const channelId = interaction.options.getString('channel') || interaction.channelId;

  await interaction.deferReply({ ephemeral: true });

  try {
    const res = await api.get(`/tickets/channel/${channelId}`);
    const ticket = res.data;

    if (!ticket) {
      return interaction.editReply({ content: '❌ No ticket found for that channel.' });
    }

    const embed = new EmbedBuilder()
      .setColor(ticket.status === 'open' ? 0x57f287 : ticket.status === 'resolved' ? 0xfee75c : 0x5865f2)
      .setTitle(`🎫 ${ticket.subject}`)
      .addFields(
        { name: 'Status', value: `\`${ticket.status}\``, inline: true },
        { name: 'Category', value: ticket.category || 'general', inline: true },
        { name: 'Priority', value: ticket.priority || 'normal', inline: true },
        { name: 'Created', value: `<t:${Math.floor(new Date(ticket.createdAt).getTime() / 1000)}:R>`, inline: true },
        { name: 'Created by', value: ticket.user?.username || 'Unknown', inline: true },
        { name: 'Channel', value: `<#${ticket.channelId}>`, inline: true },
      );

    if (ticket.assignedTo) {
      embed.addFields({ name: 'Assigned to', value: ticket.assignedTo });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    await interaction.editReply({ content: `❌ Failed: ${error.message}` });
  }
}

/* ─── Buttons ────────────────────────────────────────────── */

async function handleButton(interaction: ButtonInteraction, client: Client) {
  switch (interaction.customId) {
    case 'create_ticket':
      return showCreateTicketModal(interaction);
    case 'close_ticket':
      return handleCloseTicket(interaction);
    case 'claim_ticket':
      return handleClaimTicket(interaction);
  }
}

async function showCreateTicketModal(interaction: ButtonInteraction) {
  if (!checkCooldown(interaction.user.id)) {
    return interaction.reply({ content: '⏳ Please wait before creating another ticket.', ephemeral: true });
  }

  const modal = new ModalBuilder()
    .setCustomId('ticket_modal')
    .setTitle('Create a Support Ticket');

  const subjectInput = new TextInputBuilder()
    .setCustomId('subject')
    .setLabel('Subject')
    .setPlaceholder('Briefly describe your issue...')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const categoryInput = new TextInputBuilder()
    .setCustomId('category')
    .setLabel('Category')
    .setPlaceholder(`One of: ${TICKET_CATEGORIES.join(', ')}`)
    .setStyle(TextInputStyle.Short)
    .setRequired(false)
    .setMaxLength(20);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('description')
    .setLabel('Description')
    .setPlaceholder('Provide more details about your issue...')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setMaxLength(1000);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(subjectInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(categoryInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
  );

  await interaction.showModal(modal);
}

async function handleCloseTicket(interaction: ButtonInteraction) {
  const chan = interaction.channel as GuildTextBasedChannel | null;
  if (!chan?.isTextBased()) return;

  await interaction.deferReply();

  try {
    const res = await api.get(`/tickets/channel/${chan.id}`);
    const ticket = res.data;

    if (!ticket) {
      return interaction.editReply({ content: '❌ This channel is not linked to an open ticket.' });
    }

    await chan.send({ content: '🔒 Closing ticket in **5 seconds**...' });

    const cid = chan.id;
    setTimeout(async () => {
      try {
        await api.patch(`/tickets/${ticket.id}/close`);
        const guild = interaction.guild;
        const ch = guild?.channels.cache.get(cid) as GuildTextBasedChannel | undefined;
        if (ch?.isTextBased()) {
          await ch.send({ content: '✅ Ticket closed. Channel will be deleted shortly.' });
          setTimeout(async () => { try { await ch.delete(); } catch { } }, 5000);
        }
      } catch (error: any) {
        const guild = interaction.guild;
        const ch = guild?.channels.cache.get(cid) as GuildTextBasedChannel | undefined;
        if (ch?.isTextBased()) await ch.send({ content: `❌ Close failed: ${error.message}` });
      }
    }, 5000);

    await interaction.editReply({ content: 'Closing...' });
  } catch (error: any) {
    await interaction.editReply({ content: `❌ Error: ${error.message}` });
  }
}

async function handleClaimTicket(interaction: ButtonInteraction) {
  const chan = interaction.channel as GuildTextBasedChannel | null;
  const member = interaction.member as GuildMember;
  if (!chan?.isTextBased() || !member) return;

  await interaction.deferReply();

  try {
    const res = await api.get(`/tickets/channel/${chan.id}`);
    const ticket = res.data;

    if (!ticket) {
      return interaction.editReply({ content: '❌ This channel is not linked to an open ticket.' });
    }

    await api.patch(`/tickets/${ticket.id}/assign`, { assignedTo: member.displayName || member.user.username });

    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setDescription(`👤 **${member.displayName}** has claimed this ticket.`);

    await chan.send({ embeds: [embed] });
    await interaction.editReply({ content: `✅ You have claimed ticket **${ticket.subject}**.` });
  } catch (error: any) {
    await interaction.editReply({ content: `❌ Claim failed: ${error.message}` });
  }
}

/* ─── Modal Submit ────────────────────────────────────────── */

async function handleModalSubmit(interaction: ModalSubmitInteraction, client: Client) {
  if (interaction.customId !== 'ticket_modal') return;

  const subject = interaction.fields.getTextInputValue('subject');
  const category = interaction.fields.getTextInputValue('category') || 'general';
  const description = interaction.fields.getTextInputValue('description') || '';

  await interaction.deferReply({ ephemeral: true });

  try {
    const result = await createTicketChannel(interaction, subject, category, description);
    await notifyStaff(interaction, result.channel, subject);
    await interaction.editReply({ content: `✅ Ticket created! Check ${result.channel}` });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Failed: ${error.response?.data?.message || error.message}`,
    });
  }
}

/* ─── Core: Create Ticket Channel ────────────────────────── */

async function createTicketChannel(
  interaction: any,
  subject: string,
  category: string,
  description?: string,
) {
  const guild = interaction.guild;
  const member = interaction.member;
  const guildId = guild.id;
  const memberId = member.id;

  const res = await api.post('/tickets', { guildId, userId: memberId, subject, category });
  const ticket = res.data;

  const safe = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20) || 'ticket';
  const channelName = `ticket-${safe}-${ticket.id.slice(0, 6)}`;

  const ticketsCategory = guild.channels.cache.find(
    (ch: any) => ch.type === ChannelType.GuildCategory && ch.name.toLowerCase() === 'tickets',
  ) as CategoryChannel | undefined;

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: ticketsCategory?.id || undefined,
    permissionOverwrites: [
      { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
      {
        id: memberId,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
        ],
      },
    ],
  });

  await api.patch(`/tickets/${ticket.id}/channel`, { channelId: channel.id });

  const welcomeEmbed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`🎫 Ticket #${ticket.id.slice(0, 8)}`)
    .setDescription(subject)
    .addFields(
      { name: 'Category', value: category, inline: true },
      { name: 'Status', value: 'Open', inline: true },
      { name: 'Created by', value: member.user.tag, inline: true },
    );

  if (description) welcomeEmbed.addFields({ name: 'Description', value: description });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('claim_ticket')
      .setLabel('Claim')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('👤'),
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒'),
  );

  await channel.send({ embeds: [welcomeEmbed], components: [row] });
  return { channel, ticket };
}

/* ─── Staff Notification ─────────────────────────────────── */

async function notifyStaff(interaction: any, channel: any, subject: string) {
  const guild = interaction.guild;
  if (!guild) return;

  const staffRoles = guild.roles.cache.filter((role: any) =>
    ['admin', 'support', 'staff', 'moderator', 'mod'].some((kw) =>
      role.name.toLowerCase().includes(kw),
    ),
  );

  let ping = '';
  for (const role of staffRoles.values()) {
    if (role.mentionable) {
      ping += `<@&${role.id}> `;
    }
  }

  if (!ping) {
    const admin = guild.roles.cache.find((r: any) => r.permissions.has(PermissionsBitField.Flags.Administrator));
    if (admin) ping = `<@&${admin.id}>`;
  }

  if (ping) {
    try {
      await channel.send({ content: `${ping} — New ticket: **${subject}**` });
    } catch { /* ignore notification failures */ }
  }
}

/* ─── Rate Limiter ────────────────────────────────────────── */

function checkCooldown(userId: string): boolean {
  const last = cooldowns.get(userId);
  const now = Date.now();
  if (last && now - last < 10_000) return false;
  cooldowns.set(userId, now);
  return true;
}
