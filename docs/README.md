# Lomall

**Professional Discord Ticket Management System**

Lomall bridges the gap between Discord communities and enterprise-grade customer support. By combining Discord bot automation with a powerful web dashboard, Lomall delivers a seamless ticket management experience.

## Features

- **Bot Automation** — One-click ticket creation via Discord buttons and slash commands
- **Private Channels** — Automatic private channel creation with proper permission overwrites
- **Web Dashboard** — Real-time ticket overview, messaging, and management from your browser
- **Transcript System** — Automatic HTML archive generation when tickets are closed
- **Role-Based Access** — Granular permission control (Admin / Support / Viewer)
- **Audit Logs** — Complete history of every action taken
- **Real-Time Sync** — Socket.io powered instant updates across Discord and Web

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Discord    │────▶│  NestJS API │────▶│  PostgreSQL │
│  Bot        │     │  (Port 4000)│     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
┌─────────────┐     ┌──────┴──────┐
│  Next.js    │◀────│  Socket.io  │
│  Dashboard  │     │  (Real-time)│
│  (Port 3000)│     └─────────────┘
└─────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language  | TypeScript (full-stack) |
| Backend   | NestJS |
| Frontend  | Next.js + Tailwind CSS |
| Database  | PostgreSQL + Prisma ORM |
| Real-time | Socket.io |
| Auth      | Discord OAuth2 |
| Bot       | discord.js v14 |
