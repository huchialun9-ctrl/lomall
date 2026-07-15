# Tickets API

All ticket endpoints require JWT authentication.

## List Tickets

```http
GET /tickets?guildId=<guildId>&status=<status>
```

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `guildId` | string | Yes | Discord guild ID |
| `status` | string | No | Filter: `open`, `resolved`, `closed` |

**Response:**

```json
[
  {
    "id": "uuid",
    "channelId": "discord_channel_id",
    "subject": "Issue with login",
    "status": "open",
    "category": "technical",
    "priority": "normal",
    "createdAt": "2026-01-01T00:00:00Z",
    "user": { "username": "user", "avatar": "hash" }
  }
]
```

## Get Ticket

```http
GET /tickets/:id
```

Returns full ticket details with all messages.

## Create Ticket

```http
POST /tickets
Content-Type: application/json

{
  "guildId": "discord_guild_id",
  "subject": "Issue description",
  "category": "technical",
  "priority": "normal"
}
```

## Update Ticket Status

```http
PATCH /tickets/:id/close
PATCH /tickets/:id/reopen
```

## Assign Ticket

```http
PATCH /tickets/:id/assign
Content-Type: application/json

{
  "assignedTo": "user_id"
}
```

## Messages

### Send Message

```http
POST /tickets/:id/messages
Content-Type: application/json

{
  "content": "Message text",
  "isStaff": true
}
```

### Get Messages

```http
GET /tickets/:id/messages
```

## Update Channel ID

```http
PATCH /tickets/:id/channel
Content-Type: application/json

{
  "channelId": "discord_channel_id"
}
```
