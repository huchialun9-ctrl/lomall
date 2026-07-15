import { Interaction, Client, ChannelType, PermissionsBitField, CategoryChannel } from 'discord.js';
import { api } from '../lib/api';

export async function handleInteraction(interaction: Interaction, client: Client) {
  if (!interaction.isChatInputCommand()) return;

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
      await handleTicketCommands(interaction, subcommand);
      break;
  }
}

async function handleLomallCommands(
  interaction: any,
  subcommand: string | null,
) {
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

    await interaction.editReply({
      content: '✅ Lomall has been set up successfully! Use `/lomall dashboard` to access the web dashboard.',
    });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Setup failed: ${error.message}`,
    });
  }
}

async function handleDashboard(interaction: any) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const webUrl = process.env.WEB_URL || 'http://localhost:3000';

  await interaction.reply({
    content: `🌐 **Lomall Dashboard**\n\nAccess your dashboard here:\n${webUrl}/login\n\nAPI Status: ${apiUrl}`,
    ephemeral: true,
  });
}

async function handleConfig(interaction: any) {
  await interaction.reply({
    content: '⚙️ Use the web dashboard to modify server configuration.',
    ephemeral: true,
  });
}

async function handleTicketCommands(interaction: any, subcommand: string | null) {
  switch (subcommand) {
    case 'create':
      await handleTicketCreate(interaction);
      break;
  }
}

async function handleTicketCreate(interaction: any) {
  const subject = interaction.options.getString('subject', true);
  const category = interaction.options.getString('category') || 'general';
  const guild = interaction.guild;
  const member = interaction.member;

  await interaction.deferReply({ ephemeral: true });

  try {
    const res = await api.post('/tickets', {
      guildId: guild.id,
      userId: member.id,
      subject,
      category,
    });

    const ticket = res.data;
    const channelName = `ticket-${subject.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}-${ticket.id.slice(0, 6)}`;

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
          id: member.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    await channel.send({
      content: `🎫 **New Ticket: ${subject}**\nCategory: ${category}\nCreated by: ${member.user.tag}`,
    });

    await api.patch(`/tickets/${ticket.id}/channel`, {
      channelId: channel.id,
    });

    await interaction.editReply({
      content: `✅ Ticket created! Check ${channel}`,
    });
  } catch (error: any) {
    await interaction.editReply({
      content: `❌ Failed to create ticket: ${error.message}`,
    });
  }
}
