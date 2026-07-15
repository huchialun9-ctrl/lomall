# WebSocket Events

Lomall uses Socket.io for real-time updates between the server and dashboard.

## Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  query: { guildId: 'your_discord_guild_id' },
  transports: ['websocket', 'polling'],
});
```

## Events

### Client Receives

| Event | Payload | Description |
|-------|---------|-------------|
| `ticket:created` | `Ticket` | A new ticket was created |
| `ticket:updated` | `Ticket` | A ticket's status was changed |
| `ticket:closed` | `Ticket` | A ticket was closed |
| `message:created` | `{ ticketId, message }` | A new message was sent |

### Client Joins Room

Clients automatically join a room named `guild:<guildId>` based on the `guildId` query parameter.

## Example

```javascript
const socket = io(API_URL, { query: { guildId: '123' } });

socket.on('ticket:created', (ticket) => {
  console.log('New ticket:', ticket.subject);
});

socket.on('message:created', ({ ticketId, message }) => {
  console.log(`New message in ${ticketId}:`, message.content);
});
```
