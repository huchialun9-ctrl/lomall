# 部署上線指南

將 Lomall 部署到正式環境。

---

## 部署架構

```
┌─────────────────────────────────────────────────┐
│                  使用者                          │
│  Discord 用戶 ←→ Discord Bot                    │
│  Discord 用戶 ←→ 網頁儀表板                      │
└──────────┬──────────────────────────┬──────────┘
           │                          │
┌──────────▼──────────┐   ┌──────────▼──────────┐
│   API 伺服器         │   │   儀表板 (Next.js)   │
│   (NestJS, Port 4000)│   │   (Vercel 或自架)    │
│   Railway / Render   │   │                      │
└──────────┬──────────┘   └──────────────────────┘
           │
┌──────────▼──────────┐
│   PostgreSQL         │
│   (Supabase /        │
│    Railway / Neon)   │
└─────────────────────┘
```

---

## 部署方式

### 選項 A：Railway（全站部署，推薦）

最簡單的方式，一次部署所有服務。

**步驟：**

1. **註冊 Railway** → https://railway.app
2. **連接 GitHub** 並選擇你的 Lomall 倉庫
3. **建立 PostgreSQL 資料庫**
   - 點擊「New」→「Database」→「Add PostgreSQL」
   - 複製 `DATABASE_URL` 連線字串
4. **建立 API 服務**
   - 點擊「New」→「Deploy from GitHub repo」
   - 設定 Start Command：`npm run build:shared && npx prisma generate && npx prisma db push && cd apps/api && node dist/main.js`
   - 加入環境變數（見下方）
5. **建立 Bot 服務**
   - 同上方式建立，Start Command：`cd apps/bot && node dist/main.js`
   - 環境變數只需要 `DISCORD_BOT_TOKEN` 和 `API_URL`
6. **建立 Web 服務**
   - 使用 Vercel 部署（見選項 B）

**Railway 環境變數：**

```env
DATABASE_URL=從 Railway PostgreSQL 取得
DISCORD_BOT_TOKEN=你的 Bot Token
DISCORD_CLIENT_ID=1526773603050192936
DISCORD_CLIENT_SECRET=你的 Client Secret
NEXTAUTH_SECRET=隨機產生的一串密鑰
NEXT_PUBLIC_API_URL=https://你的-api.railway.app
API_URL=https://你的-api.railway.app
WEB_URL=https://lu0-1.gitbook.io/lomalltw
```

### 選項 B：Vercel（僅儀表板）

將 Next.js 儀表板部署到 Vercel（免費）：

1. 註冊 [Vercel](https://vercel.com)
2. 導入 GitHub 倉庫
3. 設定 Root Directory 為 `apps/web`
4. Framework 選擇 Next.js
5. 環境變數：
   ```env
   NEXT_PUBLIC_API_URL=https://你的-api.railway.app
   NEXTAUTH_SECRET=隨機密鑰
   NEXTAUTH_URL=https://你的-web.vercel.app
   WEB_URL=https://lu0-1.gitbook.io/lomalltw
   ```
6. 部署

### 選項 C：Render

1. 註冊 [Render](https://render.com)
2. 建立 **PostgreSQL** 資料庫
3. 建立 **Web Service**（API）
   - Build Command：`npm install && npm run build:shared && npx prisma generate`
   - Start Command：`npx prisma db push && node apps/api/dist/main.js`
4. 建立 **Web Service**（Bot）
   - Start Command：`node apps/bot/dist/main.js`

---

## Discord Developer Portal 設定

部署完成後，必須更新 Discord OAuth2 設定：

1. 前往 [Discord Developer Portal](https://discord.com/developers/applications)
2. 選擇你的應用程式
3. **OAuth2 → General**
   - 加入 Redirects：`https://你的-api.railway.app/auth/discord/callback`
4. **OAuth2 → URL Generator**
   - 勾選 `bot` + `identify` + `email`
   - 重新產生邀請連結並邀請 Bot 至伺服器

---

## 部署後檢查清單

- [ ] API 伺服器可正常存取（`https://你的-api.railway.app/auth/me`）
- [ ] Discord Bot 已上線（伺服器成員列表中顯示綠色）
- [ ] 已在 Discord 中執行 `/lomall setup`
- [ ] Discord OAuth2 重新導向網址已設定
- [ ] PostgreSQL 資料庫已連線（可通過 `npm run prisma:studio` 確認）

---

## 常見部署問題

**Q: API 無法連線到資料庫**
- 確認 Railway/ Render 的 PostgreSQL 連線字串是否正確
- 確認 Network 設定允許內部連線

**Q: Discord OAuth 顯示「Invalid redirect」**
- 確認 Redirect URI 與 Discord Developer Portal 設定的完全一致
- 注意結尾不能有多餘的斜線

**Q: Bot 無法登入**
- 確認 `DISCORD_BOT_TOKEN` 是否正確
- 確認 Bot Token 未過期（可在 Developer Portal 重新產生）

**Q: 如何更新文檔網站？**
- 文檔已託管於 GitBook：https://lu0-1.gitbook.io/lomalltw
- 透過 GitHub 同步或直接在 GitBook 編輯器中修改
