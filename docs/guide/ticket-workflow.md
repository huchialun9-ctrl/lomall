# Ticket Workflow

Understanding the complete ticket lifecycle in Lomall.

## Lifecycle

```
     ┌──────────┐
     │  Open    │────── Ticket created, awaiting response
     └────┬─────┘
          │
     ┌────▼─────┐
     │ Resolved │────── Issue addressed, pending confirmation
     └────┬─────┘
          │
     ┌────▼─────┐
     │  Closed  │────── Ticket archived with transcript
     └──────────┘
```

## Step-by-Step

### 1. Creation

- User runs `/ticket create` with a subject and optional category
- Lomall generates a private Discord channel
- The ticket is logged in the database with status `open`
- Staff are notified

### 2. Communication

- Staff and user communicate in the private channel
- Messages sync to the web dashboard in real-time
- Staff can also reply from the dashboard

### 3. Resolution

- Staff resolves the ticket when the issue is addressed
- Status changes to `resolved`
- The user is asked to confirm

### 4. Closure

- Tickets can be closed by staff or automatically after inactivity
- An HTML transcript is generated and stored in the database
- The Discord channel is archived
- Status changes to `closed`

### 5. Reopening

- Closed tickets can be reopened if the issue persists
- A new Discord channel is created if needed
- The original transcript remains accessible
