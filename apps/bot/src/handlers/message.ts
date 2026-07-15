import { Message, Client, ChannelType } from 'discord.js';
import { api } from '../lib/api';

const ticketCache = new Map<string, string>();

export async function handleMessage(message: Message, client: Client) {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.channel.type !== ChannelType.GuildText) return;

  const ticketId = await resolveTicketId(message.channel.id, message.guild.id);
  if (!ticketId) return;

  const member = message.member;
  const isStaff = member?.roles.cache.some((role) =>
    ['admin', 'support', 'staff', 'moderator'].some((kw) =>
      role.name.toLowerCase().includes(kw),
    ),
  ) || false;

  try {
    await api.post(`/tickets/${ticketId}/messages`, {
      userId: message.author.id,
      content: message.content,
      isStaff,
    });
  } catch {
    ticketCache.delete(message.channel.id);
  }
}

async function resolveTicketId(channelId: string, guildId: string): Promise<string | null> {
  const cached = ticketCache.get(channelId);
  if (cached) return cached;

  try {
    const res = await api.get(`/tickets/channel/${channelId}`);
    if (res.data?.id) {
      ticketCache.set(channelId, res.data.id);
      return res.data.id;
    }
  } catch { }

  return null;
}
