# Docker Deployment

Deploy Lomall using Docker Compose.

## Prerequisites

- Docker 24+
- Docker Compose 2.20+

## Configuration

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: lomall
      POSTGRES_USER: lomall
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    environment:
      DATABASE_URL: postgresql://lomall:${DB_PASSWORD}@postgres:5432/lomall
      DISCORD_BOT_TOKEN: ${DISCORD_BOT_TOKEN}
      DISCORD_CLIENT_ID: ${DISCORD_CLIENT_ID}
      DISCORD_CLIENT_SECRET: ${DISCORD_CLIENT_SECRET}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    ports:
      - "4000:4000"
    depends_on:
      - postgres

  bot:
    build:
      context: .
      dockerfile: Dockerfile.bot
    environment:
      API_URL: http://api:4000
      DISCORD_BOT_TOKEN: ${DISCORD_BOT_TOKEN}
    depends_on:
      - api

  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: http://localhost:3000
    ports:
      - "3000:3000"
    depends_on:
      - api

volumes:
  pgdata:
```

## Run

```bash
docker compose up -d
```
