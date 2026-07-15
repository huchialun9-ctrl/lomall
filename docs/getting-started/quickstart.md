# 快速開始

5 分鐘內讓 Lomall 在您的 Discord 伺服器上線。

---

## 快速連結

<table>
  <tr>
    <td width="50%" align="center">
      <p><strong>🤖 邀請 Lomall Bot</strong></p>
      <a href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands">
        <strong>🔗 點此邀請至 Discord</strong>
      </a>
      <br/><sub>（將 <code>YOUR_CLIENT_ID</code> 換為你的 Client ID）</sub>
    </td>
    <td width="50%" align="center">
      <p><strong>🌐 開啟管理儀表板</strong></p>
      <a href="https://lu0-1.gitbook.io/lomalltw">
        <strong>🔗 點此前往文檔</strong>
      </a>
      <br/><sub>📘 Lomall 完整文檔網站</sub>
    </td>
  </tr>
</table>

---

## 前置需求

- Node.js 22+
- PostgreSQL 15+
- Discord 應用程式（需有 Bot + OAuth2 憑證）

## 1. 複製與安裝

```bash
git clone <你的倉庫網址> lomall
cd lomall
npm install
```

## 2. 設定環境變數

複製範例檔並填入憑證：

```bash
cp .env.example .env
```

必要變數：

| 變數 | 說明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 連線字串 |
| `DISCORD_BOT_TOKEN` | Discord Bot Token |
| `DISCORD_CLIENT_ID` | Discord 應用程式 Client ID |
| `DISCORD_CLIENT_SECRET` | Discord OAuth2 Client Secret |

## 3. 初始化資料庫

```bash
npm run prisma:push
```

## 4. 啟動服務

分別在三個終端機執行：

```bash
# API 伺服器 (port 4000)
npm run dev:api

# Discord Bot
npm run dev:bot

# 網頁儀表板 (port 3000)
npm run dev:web
```

## 5. 在 Discord 中設定

將 Bot 邀請到伺服器後，執行：

```
/lomall setup
```

開啟瀏覽器前往文檔網站 `https://lu0-1.gitbook.io/lomalltw` 查看完整說明。

---

## 下一步

- [完整安裝指南](installation.md) — 開發環境與正式環境詳細設定
- [環境設定](configuration.md) — 所有可設定的參數說明
- [Bot 使用說明](../guide/bot-usage.md) — 所有 Discord 指令與操作詳解
