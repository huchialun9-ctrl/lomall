# Configuration

All configuration is managed through environment variables.

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lomall"

# Discord
DISCORD_BOT_TOKEN="your_bot_token"
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
DISCORD_GUILD_ID="your_guild_id"

# API
API_PORT=4000

# Web
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
WEB_URL="http://localhost:3000"
```

## Guild Settings

Configured via the dashboard or the `/lomall config` command:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `sla` | number | 24 | SLA response time (hours) |
| `autoClose` | boolean | true | Auto-close inactive tickets |
| `autoCloseHours` | number | 48 | Hours before auto-close |
| `categoryId` | string | null | Discord category for ticket channels |
| `roles` | object | {} | Role-to-permission mapping |
