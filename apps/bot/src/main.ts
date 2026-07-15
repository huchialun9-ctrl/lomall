import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });
if (!process.env.DISCORD_BOT_TOKEN) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

import { Client, GatewayIntentBits, Routes, REST, ActivityType } from 'discord.js';
import { registerCommands } from './commands';
import { handleInteraction } from './handlers/interaction';
import { handleMessage } from './handlers/message';

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

  client.user!.setPresence({
    activities: [{ name: '/ticket create', type: ActivityType.Listening }],
    status: 'online',
  });

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

client.on('messageCreate', async (message) => {
  await handleMessage(message, client);
});

client.login(process.env.DISCORD_BOT_TOKEN!).catch(console.error);
