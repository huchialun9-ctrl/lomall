# 認證機制

Lomall 使用 Discord OAuth2 進行身份驗證，並簽發 JWT Token 供 API 存取。

## Discord OAuth2 流程

### 1. 發起登入

將使用者重新導向：

```
GET /auth/discord
```

Discord 的授權頁面會要求 `identify`、`email` 與 `guilds` 權限。

### 2. 回呼處理

```
GET /auth/discord/callback
```

Discord 授權完成後重新導向至此。API 會：
- 建立或更新使用者資料
- 簽發 JWT Token
- 回傳 `{ token, user }`

### 3. 認證請求

在 HTTP Header 帶入 JWT Token：

```
Authorization: Bearer <token>
```

## API 端點

### 取得當前使用者

```http
GET /auth/me
Authorization: Bearer <token>
```

**回應：**

```json
{
  "id": "uuid",
  "discordId": "123456789",
  "username": "user",
  "avatar": "avatar_hash",
  "email": "user@example.com"
}
```

## Token 管理

- Token 有效期為 **7 天**
- 安全存放 Token（Web 使用 localStorage，Bot 使用環境變數）
- 過期後需重新認證取得新 Token
