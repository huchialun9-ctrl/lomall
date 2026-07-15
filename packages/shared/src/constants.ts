export const TICKET_CATEGORIES = [
  'general',
  'billing',
  'technical',
  'report',
  'other',
] as const;

export const TICKET_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;

export const SLASH_COMMANDS = {
  SETUP: 'lomall setup',
  DASHBOARD: 'lomall dashboard',
  TICKET_CREATE: 'ticket create',
  CONFIG: 'lomall config',
} as const;

export const PERMISSION_LEVELS: Record<string, number> = {
  viewer: 1,
  support: 2,
  admin: 3,
};

export const SOCKET_EVENTS = {
  TICKET_UPDATED: 'ticket:updated',
  TICKET_CREATED: 'ticket:created',
  MESSAGE_CREATED: 'message:created',
  TICKET_CLOSED: 'ticket:closed',
} as const;

export const DEFAULT_GUILD_SETTINGS = {
  prefix: '/',
  sla: 24,
  autoClose: true,
  autoCloseHours: 48,
};
