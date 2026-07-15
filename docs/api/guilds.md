# 伺服器 API

管理 Discord 伺服器的設定與配置。

## 取得伺服器資料

```http
GET /guilds/:discordId
```

## 初始化伺服器

```http
POST /guilds/:discordId/setup
Content-Type: application/json

{
  "name": "伺服器名稱",
  "icon": "圖示網址"
}
```

將伺服器註冊至資料庫，並初始化預設設定。

## 更新設定

```http
PUT /guilds/:discordId/settings
Content-Type: application/json

{
  "sla": 24,
  "autoClose": true,
  "autoCloseHours": 48,
  "roles": {
    "role_id_1": "admin",
    "role_id_2": "support"
  }
}
```

僅更新有提供的欄位，其餘保持不變。

## 取得審計日誌

```http
GET /guilds/:discordId/audit-logs
```

回傳該伺服器最近 100 筆審計記錄。
