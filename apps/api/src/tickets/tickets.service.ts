import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, SendMessageDto } from '@lomall/shared';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findAll(guildId: string, status?: string) {
    const where: any = { guildId };
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
    const guild = await this.prisma.guild.findUnique({ where: { discordId: dto.guildId } });
    if (!guild) throw new NotFoundException('Guild not registered');

    const ticket = await this.prisma.ticket.create({
      data: {
        channelId: `pending-${Date.now()}`,
        guildId: guild.id,
        userId: dto.userId,
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
        userId: dto.userId,
        action: 'ticket_create',
      },
    });

    return ticket;
  }

  async close(id: string, userId: string) {
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { status: 'closed', closedAt: new Date() },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: id,
        guildId: ticket.guildId,
        userId,
        action: 'ticket_close',
      },
    });

    return ticket;
  }

  async reopen(id: string, userId: string) {
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { status: 'open', closedAt: null },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: id,
        guildId: ticket.guildId,
        userId,
        action: 'ticket_reopen',
      },
    });

    return ticket;
  }

  async assign(id: string, assignedTo: string, userId: string) {
    const ticket = await this.prisma.ticket.update({
      where: { id },
      data: { assignedTo },
      include: { user: true },
    });

    await this.prisma.auditLog.create({
      data: {
        ticketId: id,
        guildId: ticket.guildId,
        userId,
        action: 'ticket_assign',
        details: { assignedTo },
      },
    });

    return ticket;
  }

  async sendMessage(ticketId: string, dto: SendMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        ticketId,
        userId: dto.userId,
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

  async getAuditLogs(guildId: string) {
    return this.prisma.auditLog.findMany({
      where: { guildId },
      include: { user: true, ticket: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
