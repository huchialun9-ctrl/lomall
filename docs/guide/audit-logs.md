# 審計日誌

Lomall 記錄每一筆操作，確保完整的責任歸屬。

## 記錄的動作

| 動作 | 說明 |
|------|------|
| `ticket_create` | 建立新工單 |
| `ticket_close` | 關閉工單 |
| `ticket_reopen` | 重新開啟已關閉的工單 |
| `ticket_assign` | 指派工單給管理員 |
| `message_delete` | 刪除訊息 |
| `settings_update` | 修改伺服器設定 |

## 檢視日誌

### 網頁儀表板

在側邊欄點擊 **Audit Logs**。每筆記錄包含：
- **使用者** — 執行操作的人
- **動作** — 操作類型
- **工單** — 關聯的工單（如適用）
- **時間戳** — 操作時間

### API

```http
GET /guilds/:discordId/audit-logs
Authorization: Bearer <token>
```

回傳最近 100 筆審計記錄。

## 保存期限

審計日誌會永久保存於資料庫中。可透過儀表板或 API 匯出或清理舊記錄。
