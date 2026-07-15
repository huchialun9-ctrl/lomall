# Installation

Detailed installation guide for production and development environments.

## Development Setup

### System Requirements

- **OS**: Windows 10+, macOS 12+, or Linux
- **Runtime**: Node.js 22.x or later
- **Database**: PostgreSQL 15+
- **Package Manager**: npm 10+

### Database Setup

```bash
# Create the database
createdb lomall

# Push the Prisma schema
npm run prisma:push

# (Optional) Open Prisma Studio to inspect data
npm run prisma:studio
```

### Discord Application Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to **Bot** → **Add Bot**
4. Copy the token under **Bot** section
5. Go to **OAuth2** → **General** and copy Client ID and Client Secret
6. Add redirect URL: `http://localhost:4000/auth/discord/callback`
7. In **OAuth2** → **URL Generator**, select `bot` and `identify` scopes
8. Use the generated URL to invite the bot to your server

## Production Build

```bash
# Build all packages
npm run build:shared
npm run build:api
npm run build:bot
npm run build:web

# Start production services
npm run start:api
npm run start:bot
npm run start:web
```
