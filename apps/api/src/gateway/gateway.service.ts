import { Injectable } from '@nestjs/common';
import { GatewayGateway } from './gateway.gateway';
import { SOCKET_EVENTS } from '@lomall/shared';

@Injectable()
export class GatewayService {
  constructor(private gateway: GatewayGateway) {}

  emitTicketCreated(ticket: any) {
    this.gateway.server.to(`guild:${ticket.guildId}`).emit(SOCKET_EVENTS.TICKET_CREATED, ticket);
  }

  emitTicketUpdated(ticket: any) {
    this.gateway.server.to(`guild:${ticket.guildId}`).emit(SOCKET_EVENTS.TICKET_UPDATED, ticket);
  }

  emitMessageCreated(ticketId: string, message: any) {
    this.gateway.server.emit(SOCKET_EVENTS.MESSAGE_CREATED, { ticketId, message });
  }

  emitTicketClosed(ticket: any) {
    this.gateway.server.to(`guild:${ticket.guildId}`).emit(SOCKET_EVENTS.TICKET_CLOSED, ticket);
  }
}
