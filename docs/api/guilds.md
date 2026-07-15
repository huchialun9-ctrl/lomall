# Guilds API

Manage Discord server configuration.

## Get Guild

```http
GET /guilds/:discordId
```

## Setup Guild

```http
POST /guilds/:discordId/setup
Content-Type: application/json

{
  "name": "Server Name",
  "icon": "icon_url"
}
```

Initializes a guild in the database with default settings.

## Update Settings

```http
PUT /guilds/:discordId/settings
Content-Type: application/json

{
  "sla": 24,
  "autoClose": true,
  "autoCloseHours": 48,
  "roles": {
    "role_id_1": "admin",
    "role_id_2": "support"
  }
}
```

Merges with existing settings — only provided fields are updated.

## Get Audit Logs

```http
GET /guilds/:discordId/audit-logs
```

Returns the 100 most recent audit log entries for the guild.
