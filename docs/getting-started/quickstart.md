# Quick Start

Get Lomall up and running in minutes.

## Prerequisites

- Node.js 22+
- PostgreSQL 15+
- Discord application with Bot + OAuth2 credentials

## 1. Clone & Install

```bash
git clone <your-repo> lomall
cd lomall
npm install
```

## 2. Configure Environment

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `DISCORD_BOT_TOKEN` | Your Discord bot token |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 client secret |

## 3. Setup Database

```bash
npm run prisma:push
```

## 4. Start Services

In separate terminals:

```bash
# API server (port 4000)
npm run dev:api

# Discord bot
npm run dev:bot

# Web dashboard (port 3000)
npm run dev:web
```

## 5. Setup in Discord

Invite your bot to a server, then run:

```
/lomall setup
```

Visit the dashboard at `http://localhost:3000`.
