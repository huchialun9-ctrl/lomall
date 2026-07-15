# 安裝指南

開發環境與正式環境的完整安裝說明。

## 開發環境

### 系統需求

- **作業系統**：Windows 10+、macOS 12+ 或 Linux
- **執行環境**：Node.js 22.x 或更新版本
- **資料庫**：PostgreSQL 15+
- **套件管理**：npm 10+

### 資料庫設定

```bash
# 建立資料庫
createdb lomall

# 推送 Prisma Schema 至資料庫
npm run prisma:push

# （可選）開啟 Prisma Studio 圖形化介面
npm run prisma:studio
```

### Discord 應用程式設定

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 建立新的應用程式
3. 進入 **Bot** → **Add Bot**
4. 複製 Bot Token
5. 進入 **OAuth2** → **General**，複製 Client ID 與 Client Secret
6. 設定重新導向網址：`http://localhost:4000/auth/discord/callback`
7. 在 **OAuth2** → **URL Generator** 勾選 `bot` 與 `identify` 權限
8. 使用產生的網址將 Bot 邀請至伺服器

## 正式環境

```bash
# 建置所有套件
npm run build:shared
npm run build:api
npm run build:bot
npm run build:web

# 啟動正式服務
npm run start:api
npm run start:bot
npm run start:web
```
