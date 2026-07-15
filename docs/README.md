# Lomall

**專業級 Discord 工單管理系統**

Lomall 為 Discord 社群提供企業等級的工單管理解決方案。透過 Discord Bot 自動化與網頁儀表板的深度結合，實現高效、透明且可追溯的客服流程。

---

## 立即開始

<table>
  <tr>
    <td width="50%" align="center">
      <p><strong>🤖 邀請 Bot 至 Discord</strong></p>
      <p>將 Lomall Bot 加入你的伺服器</p>
      <p>
        <a href="https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands">
          <strong>🔗 邀請 Lomall Bot</strong>
        </a>
      </p>
      <p><sub>※ 請將 <code>YOUR_CLIENT_ID</code> 替換為你的 Discord 應用程式 ID</sub></p>
    </td>
    <td width="50%" align="center">
      <p><strong>🌐 開啟管理儀表板</strong></p>
      <p>登入網頁後台管理工單</p>
      <p>
        <a href="http://localhost:3000/login">
          <strong>🔗 前往儀表板</strong>
        </a>
      </p>
      <p><sub>※ 本機開發預設為 <code>localhost:3000</code>，正式部署請替換為實際網址</sub></p>
    </td>
  </tr>
</table>

---

## 功能特色

| 功能 | 說明 |
|------|------|
| 🤖 **Bot 自動化** | 按鈕與斜線指令一鍵建立工單 |
| 🔒 **私密頻道** | 自動建立專屬頻道，嚴格的權限隔離 |
| 📊 **網頁儀表板** | 即時工單總覽、對話管理，跨平台操作 |
| 📄 **轉存系統** | 結案時自動產生 HTML 封存檔，永久保存 |
| 👥 **角色權限** | Admin / Support / Viewer 分級管理 |
| 📋 **審計日誌** | 完整記錄每一筆操作，責任歸屬明確 |
| ⚡ **即時同步** | Socket.io 驅動 Discord 與網頁雙向即時更新 |

## 系統架構

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Discord    │────▶│  NestJS API │────▶│  PostgreSQL │
│  Bot        │     │  (Port 4000)│     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
┌─────────────┐     ┌──────┴──────┐
│  Next.js    │◀────│  Socket.io  │
│  儀表板     │     │  (即時推播) │
│  (Port 3000)│     └─────────────┘
└─────────────┘
```

## 技術堆疊

| 元件 | 技術 |
|------|------|
| 開發語言 | TypeScript（全端統一） |
| 後端框架 | NestJS |
| 前端框架 | Next.js + Tailwind CSS |
| 資料庫 | PostgreSQL + Prisma ORM |
| 即時通訊 | Socket.io |
| 驗證 | Discord OAuth2 |
| Bot | discord.js v14 |
