# 環境變數說明

Lomall 所有環境變數完整參考。

## 資料庫

| 變數 | 必填 | 預設值 | 說明 |
|------|------|--------|------|
| `DATABASE_URL` | 是 | - | PostgreSQL 連線字串 |

## Discord

| 變數 | 必填 | 預設值 | 說明 |
|------|------|--------|------|
| `DISCORD_BOT_TOKEN` | 是 | - | Discord Developer Portal 的 Bot Token |
| `DISCORD_CLIENT_ID` | 是 | - | OAuth2 Client ID |
| `DISCORD_CLIENT_SECRET` | 是 | - | OAuth2 Client Secret |
| `DISCORD_GUILD_ID` | 否 | - | 開發用的預設伺服器 ID |

## API

| 變數 | 必填 | 預設值 | 說明 |
|------|------|--------|------|
| `API_PORT` | 否 | `4000` | API 伺服器埠號 |
| `NEXT_PUBLIC_API_URL` | 是 | `http://localhost:4000` | 公開 API 網址（Bot 與 Web 使用） |

## 網頁儀表板

| 變數 | 必填 | 預設值 | 說明 |
|------|------|--------|------|
| `NEXTAUTH_SECRET` | 是 | - | Session Token 加密密鑰 |
| `NEXTAUTH_URL` | 否 | `http://localhost:3000` | 儀表板基礎網址 |
| `WEB_URL` | 否 | `http://localhost:3000` | 公開儀表板網址 |
