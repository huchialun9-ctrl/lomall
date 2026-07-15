import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export type CommandBuilder = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;

export function registerCommands(): CommandBuilder[] {
  return [
    new SlashCommandBuilder()
      .setName('lomall')
      .setDescription('Lomall ticket system')
      .addSubcommand((sub) =>
        sub.setName('setup').setDescription('Initialize Lomall for this server'),
      )
      .addSubcommand((sub) =>
        sub.setName('dashboard').setDescription('Get your dashboard login link'),
      )
      .addSubcommand((sub) =>
        sub
          .setName('config')
          .setDescription('View or modify server configuration')
          .addStringOption((opt) =>
            opt
              .setName('setting')
              .setDescription('Setting to view or modify')
              .setRequired(false)
              .addChoices(
                { name: 'SLA (hours)', value: 'sla' },
                { name: 'Auto-close', value: 'autoClose' },
                { name: 'Auto-close (hours)', value: 'autoCloseHours' },
              ),
          )
          .addStringOption((opt) =>
            opt
              .setName('value')
              .setDescription('New value for the setting')
              .setRequired(false),
          ),
      ),

    new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('Ticket management')
      .addSubcommand((sub) =>
        sub
          .setName('create')
          .setDescription('Create a new ticket')
          .addStringOption((opt) =>
            opt.setName('subject').setDescription('Ticket subject').setRequired(true),
          )
          .addStringOption((opt) =>
            opt
              .setName('category')
              .setDescription('Ticket category')
              .setRequired(false)
              .addChoices(
                { name: 'General', value: 'general' },
                { name: 'Billing', value: 'billing' },
                { name: 'Technical', value: 'technical' },
                { name: 'Report', value: 'report' },
                { name: 'Other', value: 'other' },
              ),
          ),
      )
      .addSubcommand((sub) =>
        sub
          .setName('panel')
          .setDescription('Send the ticket creation panel to this channel'),
      ),
  ];
}
