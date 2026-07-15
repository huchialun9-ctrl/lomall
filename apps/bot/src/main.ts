import { Client, GatewayIntentBits, Routes, REST, SlashCommandBuilder } from 'discord.js';
import { registerCommands } from './commands';
import { handleInteraction } from './handlers/interaction';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user!.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);
  const commands = registerCommands();

  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commands.map((cmd) => cmd.toJSON()),
    });
    console.log('Slash commands registered');
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  await handleInteraction(interaction, client);
});

client.login(process.env.DISCORD_BOT_TOKEN!).catch(console.error);
