# Environment Variables

Complete reference of all environment variables used by Lomall.

## Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |

## Discord

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DISCORD_BOT_TOKEN` | Yes | - | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | Yes | - | OAuth2 client ID |
| `DISCORD_CLIENT_SECRET` | Yes | - | OAuth2 client secret |
| `DISCORD_GUILD_ID` | No | - | Default guild ID for development |

## API

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_PORT` | No | `4000` | API server port |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:4000` | Public API URL (used by bot and web) |

## Web Dashboard

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXTAUTH_SECRET` | Yes | - | Encryption secret for session tokens |
| `NEXTAUTH_URL` | No | `http://localhost:3000` | Dashboard base URL |
| `WEB_URL` | No | `http://localhost:3000` | Public web URL |
