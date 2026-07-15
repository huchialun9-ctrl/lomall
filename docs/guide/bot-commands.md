# Bot Commands

Lomall provides slash commands for Discord interaction.

## Commands Overview

### `/lomall setup`

Initialize Lomall for your Discord server.

```
/lomall setup
```

Creates the guild record in the database and prepares the server for ticket management. Run this once after inviting the bot.

### `/lomall dashboard`

Get the web dashboard login link.

```
/lomall dashboard
```

Returns a link to access the Lomall web dashboard.

### `/lomall config`

View or modify server configuration.

```
/lomall config
```

Opens configuration options for SLA, auto-close, and permission settings.

### `/ticket create`

Create a new support ticket.

```
/ticket create subject:<text> category:<category>
```

**Parameters:**

| Option | Required | Description |
|--------|----------|-------------|
| `subject` | Yes | Brief description of the issue |
| `category` | No | Ticket category (general, billing, technical, report, other) |

**What happens:**
1. A private Discord channel is created
2. Permission overwrites restrict access to the ticket creator and staff
3. A welcome message is posted in the channel
4. The ticket appears in the web dashboard

## Permission Requirements

| Command | Required Permission |
|---------|-------------------|
| `/lomall setup` | Administrator |
| `/lomall dashboard` | None |
| `/lomall config` | Administrator |
| `/ticket create` | None |
