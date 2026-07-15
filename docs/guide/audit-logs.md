# Audit Logs

Lomall records every action for full accountability.

## Tracked Actions

| Action | Description |
|--------|-------------|
| `ticket_create` | A new ticket was created |
| `ticket_close` | A ticket was closed |
| `ticket_reopen` | A closed ticket was reopened |
| `ticket_assign` | A ticket was assigned to a staff member |
| `message_delete` | A message was removed |
| `settings_update` | Server settings were modified |

## Viewing Logs

### Web Dashboard

Navigate to **Audit Logs** in the sidebar. Each entry shows:

- **User** — Who performed the action
- **Action** — What was done
- **Ticket** — Which ticket (if applicable)
- **Timestamp** — When it happened

### API

```http
GET /guilds/:discordId/audit-logs
Authorization: Bearer <token>
```

Returns the 100 most recent audit log entries.

## Retention

Audit logs are retained indefinitely in the database. Use the dashboard or API to export or purge logs as needed.
