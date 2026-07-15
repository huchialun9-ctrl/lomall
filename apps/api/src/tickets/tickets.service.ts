import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, SendMessageDto } from '@lomall/shared';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  private async resolveGuild(discordId: string) {
    const guild = await this.prisma.guild.findUnique({ where: { discordId } });
    if (!guild) throw new NotFoundException('Guild not registered. Run /lomall setup first.');
    return guild;
  }

  private async resolveOrCreateUser(discordId: string, username?: string) {
    return this.prisma.user.upsert({
      where: { discordId },
      update: { username: username || `discord-${discordId}` },
      create: {
        discordId,
        username: username || `discord-${discordId}`,
      },
    });
  }

  async findAll(guildDiscordId: string, status?: string) {
    const guild = await this.resolveGuild(guildDiscordId);
    const where: any = { guildId: guild.id };
    if (status) where.status = status;
    return this.prisma.ticket.findMany({
      where,
      include: { user: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { user: true, messages: { include: { user: true }, orderBy: { createdAt: 'asc' } } },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async create(dto: CreateTicketDto) {
    const guild = await this.resolveGuild(dto.guildId);
    const user = await this.resolveOrCreateUser(dto.userId);

    const ticket = await this.prisma.ticket.create({
      data: {
        channelId: `pending-${Date.now()}`,
        guildId: guild.id,
        userId: user.id,
        subject: dto.subject,
        category: dto.category,
        priority: dto.priority,
      },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: ticket.id,
        guildId: guild.id,
        userId: user.id,
        action: 'ticket_create',
      },
    });

    return ticket;
  }

  async close(id: string, userDiscordId: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    const user = await this.resolveOrCreateUser(userDiscordId);

    const updated = await this.prisma.ticket.update({
      where: { id },
      data: { status: 'closed', closedAt: new Date() },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: id,
        guildId: ticket.guildId,
        userId: user.id,
        action: 'ticket_close',
      },
    });

    return updated;
  }

  async reopen(id: string, userDiscordId: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    const user = await this.resolveOrCreateUser(userDiscordId);

    const updated = await this.prisma.ticket.update({
      where: { id },
      data: { status: 'open', closedAt: null },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: id,
        guildId: ticket.guildId,
        userId: user.id,
        action: 'ticket_reopen',
      },
    });

    return updated;
  }

  async assign(id: string, assignedTo: string, userDiscordId: string) {
    const user = await this.resolveOrCreateUser(userDiscordId);
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const updated = await this.prisma.ticket.update({
      where: { id },
      data: { assignedTo },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: id,
        guildId: ticket.guildId,
        userId: user.id,
        action: 'ticket_assign',
        details: { assignedTo },
      },
    });

    return updated;
  }

  async sendMessage(ticketId: string, dto: SendMessageDto) {
    const user = await this.resolveOrCreateUser(dto.userId);

    const message = await this.prisma.message.create({
      data: {
        ticketId,
        userId: user.id,
        content: dto.content,
        isStaff: dto.isStaff,
      },
      include: { user: true },
    });

    return message;
  }

  async getMessages(ticketId: string) {
    return this.prisma.message.findMany({
      where: { ticketId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateChannel(id: string, channelId: string) {
    return this.prisma.ticket.update({
      where: { id },
      data: { channelId },
    });
  }

  async findByChannelId(channelId: string) {
    return this.prisma.ticket.findFirst({ where: { channelId } });
  }
}
