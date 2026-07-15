# Bot 指令總覽

Lomall Bot 提供完整的斜線指令（Slash Commands）系統。

## 指令一覽

| 指令 | 說明 | 誰可以使用 |
|------|------|-----------|
| `/lomall setup` | 初次設定伺服器 | 管理員 |
| `/lomall dashboard` | 取得儀表板連結 | 所有人 |
| `/lomall config` | 檢視/修改伺服器設定 | 管理員 |
| `/ticket create` | 建立新工單 | 所有人 |
| `/ticket panel` | 發送工單建立按鈕面板 | 管理員 |
| `/ticket list` | 顯示伺服器工單統計 | 管理員/客服 |
| `/ticket close` | 關閉指定頻道的工單 | 管理員/客服 |
| `/ticket info` | 查詢工單詳細資訊 | 管理員/客服 |

## 詳細說明

### `/lomall setup` — 初始化伺服器

```
/lomall setup
```

初次使用 Lomall 時必須執行。系統會：
- 將伺服器註冊至資料庫
- 建立預設設定
- 自動建立 `Tickets` 頻道分類（若不存在）

**權限需求：** 管理伺服器

### `/lomall dashboard` — 儀表板連結

```
/lomall dashboard
```

回傳包含儀表板連結的嵌入訊息，點擊後使用 Discord 帳號登入。

### `/lomall config` — 伺服器設定

檢視目前設定：
```
/lomall config
```

修改設定：
```
/lomall config setting:sla value:24
```

### `/ticket create` — 建立工單

```
/ticket create subject:<標題> category:<分類>
```

| 參數 | 必填 | 說明 |
|------|------|------|
| `subject` | 是 | 工單標題（1-100 字） |
| `category` | 否 | 分類：General / Billing / Technical / Report / Other |

### `/ticket panel` — 工單按鈕面板

```
/ticket panel
```

在當前頻道發送含「🎫 Create Ticket」按鈕的面板。

### `/ticket list` — 工單統計

```
/ticket list
```

顯示伺服器的工單數量統計與最近開啟的工單列表。

### `/ticket close` — 關閉工單

```
/ticket close channel:<頻道ID>
```

關閉指定頻道的工單，5 秒後自動刪除頻道。若未指定頻道則使用當前頻道。

### `/ticket info` — 工單資訊

```
/ticket info channel:<頻道ID>
```

顯示工單的詳細資訊（狀態、分類、優先級、建立時間等）。

## 權限需求

| 指令 | 需求權限 |
|------|---------|
| `/lomall setup` | 管理員 |
| `/lomall config` | 管理員 |
| `/ticket panel` | 管理員 |
| `/ticket list` | Support 以上 |
| `/ticket close` | Support 以上 |
| `/ticket info` | Support 以上 |
| `/lomall dashboard` | 無 |
| `/ticket create` | 無 |
