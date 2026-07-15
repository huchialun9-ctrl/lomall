# WebSocket 即時事件

Lomall 使用 Socket.io 實現伺服器與儀表板之間的即時資料更新。

## 連線方式

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  query: { guildId: '你的 Discord 伺服器 ID' },
  transports: ['websocket', 'polling'],
});
```

## 事件列表

### 客戶端接收

| 事件 | 資料 | 說明 |
|------|------|------|
| `ticket:created` | `Ticket` | 有新工單建立 |
| `ticket:updated` | `Ticket` | 工單狀態變更 |
| `ticket:closed` | `Ticket` | 工單已關閉 |
| `message:created` | `{ ticketId, message }` | 有新訊息發送 |

### 頻道訂閱

客戶端根據連線時提供的 `guildId` 自動加入 `guild:<guildId>` 頻道，僅接收所屬伺服器的事件。

## 範例

```javascript
const socket = io(API_URL, { query: { guildId: '123' } });

socket.on('ticket:created', (ticket) => {
  console.log('新工單：', ticket.subject);
});

socket.on('message:created', ({ ticketId, message }) => {
  console.log(`工單 ${ticketId} 有新訊息：`, message.content);
});
```
