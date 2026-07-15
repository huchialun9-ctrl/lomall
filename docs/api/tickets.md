# 工單 API

所有工單端點需要 JWT 認證。

## 列出工單

```http
GET /tickets?guildId=<guildId>&status=<status>
```

**查詢參數：**

| 參數 | 型態 | 必填 | 說明 |
|------|------|------|------|
| `guildId` | string | 是 | Discord 伺服器 ID |
| `status` | string | 否 | 篩選：`open`、`resolved`、`closed` |

**回應：**

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

## 取得單一工單

```http
GET /tickets/:id
```

回傳完整的工單詳細資料與所有訊息。

## 依頻道 ID 查詢

```http
GET /tickets/channel/:channelId
```

## 建立工單

```http
POST /tickets
Content-Type: application/json

{
  "guildId": "discord_guild_id",
  "userId": "discord_user_id",
  "subject": "問題描述",
  "category": "technical",
  "priority": "normal"
}
```

## 更新工單狀態

```http
PATCH /tickets/:id/close
PATCH /tickets/:id/reopen
```

## 指派工單

```http
PATCH /tickets/:id/assign
Content-Type: application/json

{
  "assignedTo": "管理員名稱"
}
```

## 訊息管理

### 發送訊息

```http
POST /tickets/:id/messages
Content-Type: application/json

{
  "userId": "discord_user_id",
  "content": "訊息內容",
  "isStaff": true
}
```

### 取得訊息列表

```http
GET /tickets/:id/messages
```

## 更新頻道 ID

```http
PATCH /tickets/:id/channel
Content-Type: application/json

{
  "channelId": "discord_channel_id"
}
```
