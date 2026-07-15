# 環境設定

所有設定透過環境變數進行管理。

## 環境變數

```env
# 資料庫
DATABASE_URL="postgresql://user:password@localhost:5432/lomall"

# Discord
DISCORD_BOT_TOKEN="your_bot_token"
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
DISCORD_GUILD_ID="your_guild_id"

# API
API_PORT=4000

# 網頁
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
WEB_URL="http://localhost:3000"
```

## 伺服器設定

可透過儀表板或 `/lomall config` 指令修改：

| 設定 | 型態 | 預設值 | 說明 |
|------|------|--------|------|
| `sla` | 數字（小時） | 24 | SLA 目標回應時間 |
| `autoClose` | 布林值 | true | 是否自動關閉閒置工單 |
| `autoCloseHours` | 數字（小時） | 48 | 閒置多久後自動關閉 |
| `categoryId` | 字串 | null | 工單頻道所屬分類 ID |
| `roles` | 物件 | {} | 角色與權限對應表 |
