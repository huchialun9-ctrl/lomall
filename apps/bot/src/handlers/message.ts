import { Message, Client, ChannelType } from 'discord.js';
import { api } from '../lib/api';

const ticketChannelCache = new Map<string, string>();

async function fetchTicketId(channelId: string, guildId: string): Promise<string | null> {
  if (ticketChannelCache.has(channelId)) {
    return ticketChannelCache.get(channelId)!;
  }

  try {
    const res = await api.get('/tickets', {
      params: { guildId, status: 'open' },
    });
    const tickets = res.data;
    const ticket = tickets.find((t: any) => t.channelId === channelId);

    if (ticket) {
      ticketChannelCache.set(channelId, ticket.id);
      return ticket.id;
    }
  } catch { }

  return null;
}

export async function handleMessage(message: Message, client: Client) {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.channel.type !== ChannelType.GuildText) return;

  const ticketId = await fetchTicketId(message.channel.id, message.guild.id);
  if (!ticketId) return;

  const member = message.member;
  const isStaff = member?.roles.cache.some((role) =>
    role.name.toLowerCase().includes('admin') ||
    role.name.toLowerCase().includes('support') ||
    role.name.toLowerCase().includes('staff'),
  ) || false;

  try {
    await api.post(`/tickets/${ticketId}/messages`, {
      content: message.content,
      isStaff,
    });
  } catch { }
}
