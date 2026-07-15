# Permission System

Lomall integrates with Discord roles for granular permission control.

## Permission Levels

| Level | Role | Capabilities |
|-------|------|-------------|
| **3** | Admin | Full access: manage settings, assign tickets, view all |
| **2** | Support | Manage tickets, reply to conversations |
| **1** | Viewer | Read-only access to tickets and audit logs |

## Configuration

### Via Discord

Role-based permissions are configured through the Discord server role settings and synchronized with Lomall.

### Via Dashboard

Admins can manage role mappings in the dashboard settings:

```json
{
  "roles": {
    "admin_role_id": "admin",
    "support_role_id": "support",
    "viewer_role_id": "viewer"
  }
}
```

## Channel Permissions

When a ticket is created, Lomall automatically sets Discord channel permissions:

- **@everyone** — Denied access
- **Ticket Creator** — Read, send messages, read history
- **Admin Roles** — Read, send messages, manage channels
- **Support Roles** — Read, send messages
