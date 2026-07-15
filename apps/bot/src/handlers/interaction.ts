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
} from 'discord.js';
import { api } from '../lib/api';
import { TICKET_CATEGORIES } from '@lomall/shared';

export async function handleInteraction(interaction: Interaction, client: Client) {
  if (interaction.isChatInputCommand()) {
    await handleSlashCommand(interaction, client);
  } else if (interaction.isButton()) {
    await handleButton(interaction, client);
  } else if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction, client);
  }
}

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

async function handleLomallCommands(interaction: any, subcommand: string | null) {
  switch (subcommand) {
    case 'setup':
      await handleSetup(interaction);
      break;
    case 'dashboard':
      await handleDashboard(interaction);
      break;
    case 'config':
      await handleConfig(interaction);
      break;
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

    const webUrl = process.env.WEB_URL || 'http://localhost:3000';

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('✅ Lomall Setup Complete')
      .setDescription('Your server is now ready for ticket management.')
      .addFields(
        { name: 'Dashboard', value: `[Open Dashboard](${webUrl}/login)`, inline: true },
        { name: 'Quick Start', value: 'Use `/ticket panel` to create a ticket button', inline: true },
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
        content: `❌ Failed to update config: ${error.response?.data?.message || error.message}`,
      });
    }
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const res = await api.get(`/guilds/${guild.id}`);
    const guildData = res.data;
    const settings = guildData.settings || {};

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`⚙️ ${guild.name} Configuration`)
      .addFields(
        { name: 'SLA (hours)', value: `\`${settings.sla || 24}\``, inline: true },
        { name: 'Auto-close', value: `\`${settings.autoClose !== false ? 'Enabled' : 'Disabled'}\``, inline: true },
        { name: 'Auto-close (hours)', value: `\`${settings.autoCloseHours || 48}\``, inline: true },
      )
      .setFooter({ text: 'Use /lomall config <setting> <value> to update' });

    await interaction.editReply({ embeds: [embed] });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Failed to fetch config. Did you run \`/lomall setup\` first?`,
    });
  }
}

async function handleTicketCommands(interaction: any, subcommand: string | null, client: Client) {
  switch (subcommand) {
    case 'create':
      await handleTicketCreate(interaction);
      break;
    case 'panel':
      await handleTicketPanel(interaction);
      break;
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

  await interaction.deferReply({ ephemeral: true });

  try {
    const ticket = await createTicketChannel(interaction, subject, category);

    await interaction.editReply({
      content: `✅ Ticket created! Check ${ticket.channel}`,
    });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Failed to create ticket: ${error.response?.data?.message || error.message}`,
    });
  }
}

async function handleButton(interaction: ButtonInteraction, client: Client) {
  switch (interaction.customId) {
    case 'create_ticket':
      await showCreateTicketModal(interaction);
      break;
    case 'close_ticket':
      await handleCloseTicket(interaction);
      break;
  }
}

async function showCreateTicketModal(interaction: ButtonInteraction) {
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

  const firstRow = new ActionRowBuilder<TextInputBuilder>().addComponents(subjectInput);
  const secondRow = new ActionRowBuilder<TextInputBuilder>().addComponents(categoryInput);
  const thirdRow = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

  modal.addComponents(firstRow, secondRow, thirdRow);

  await interaction.showModal(modal);
}

async function handleModalSubmit(interaction: ModalSubmitInteraction, client: Client) {
  if (interaction.customId !== 'ticket_modal') return;

  const subject = interaction.fields.getTextInputValue('subject');
  const category = interaction.fields.getTextInputValue('category') || 'general';
  const description = interaction.fields.getTextInputValue('description') || '';

  await interaction.deferReply({ ephemeral: true });

  try {
    const ticket = await createTicketChannel(interaction, subject, category, description);

    await interaction.editReply({
      content: `✅ Ticket created! Check ${ticket.channel}`,
    });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Failed to create ticket: ${error.response?.data?.message || error.message}`,
    });
  }
}

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

  const res = await api.post('/tickets', {
    guildId,
    userId: memberId,
    subject,
    category,
  });

  const ticket = res.data;
  const safeSubject = subject.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 20);
  const channelName = `ticket-${safeSubject}-${ticket.id.slice(0, 6)}`;

  const categoryChannel = guild.channels.cache.find(
    (ch: any) =>
      ch.type === ChannelType.GuildCategory &&
      ch.name.toLowerCase() === 'tickets',
  ) as CategoryChannel | undefined;

  const channel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: categoryChannel?.id || undefined,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
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

  await api.patch(`/tickets/${ticket.id}/channel`, {
    channelId: channel.id,
  });

  const welcomeEmbed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle(`🎫 Ticket #${ticket.id.slice(0, 8)}`)
    .setDescription(subject)
    .addFields(
      { name: 'Category', value: category, inline: true },
      { name: 'Status', value: 'Open', inline: true },
      { name: 'Created by', value: member.user.tag, inline: true },
    );

  if (description) {
    welcomeEmbed.addFields({ name: 'Description', value: description });
  }

  const closeRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Close Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒'),
  );

  await channel.send({ embeds: [welcomeEmbed], components: [closeRow] });

  return { channel, ticket };
}

async function handleCloseTicket(interaction: ButtonInteraction) {
  const channel = interaction.channel;
  if (!channel) return;

  await interaction.deferReply();

  try {
    const ticketsRes = await api.get('/tickets', {
      params: { guildId: interaction.guildId, status: 'open' },
    });
    const tickets = ticketsRes.data;
    const ticket = tickets.find((t: any) => t.channelId === channel.id);

    if (!ticket) {
      await interaction.editReply({ content: '❌ This channel is not linked to an open ticket.' });
      return;
    }

    const ticketId = ticket.id;

    await channel.send({ content: '🔒 Closing ticket in 5 seconds...' });

    setTimeout(async () => {
      try {
        await api.patch(`/tickets/${ticketId}/close`);

        await channel.send({ content: '✅ Ticket closed. Channel will be deleted shortly.' });

        setTimeout(async () => {
          try {
            await channel.delete();
          } catch { }
        }, 5000);
      } catch (error: any) {
        await channel.send({ content: `❌ Failed to close ticket: ${error.message}` });
      }
    }, 5000);

    await interaction.editReply({ content: 'Closing...' });
  } catch (error: any) {
    await interaction.editReply({ content: `❌ Error: ${error.message}` });
  }
}
