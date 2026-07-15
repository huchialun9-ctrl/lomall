export type TicketStatus = 'open' | 'resolved' | 'closed';

export type AuditAction =
  | 'ticket_create'
  | 'ticket_close'
  | 'ticket_reopen'
  | 'ticket_assign'
  | 'message_delete'
  | 'settings_update';

export type UserRole = 'admin' | 'support' | 'viewer';

export interface GuildSettings {
  prefix?: string;
  sla?: number;
  autoClose?: boolean;
  autoCloseHours?: number;
  categoryId?: string;
  roles?: Record<string, UserRole>;
}

export interface CreateTicketDto {
  guildId: string;
  userId: string;
  subject: string;
  category?: string;
  priority?: string;
}

export interface SendMessageDto {
  ticketId: string;
  userId: string;
  content: string;
  isStaff: boolean;
}
