# 自架伺服器

在自己的基礎設施上部署 Lomall。

## 正式環境建置

```bash
# 安裝依賴
npm install

# 建置共用套件
npm run build:shared

# 建置所有應用程式
npm run build:api
npm run build:bot
npm run build:web
```

## 使用行程管理工具

建議使用 [PM2](https://pm2.keymetrics.io/)：

```bash
npm install -g pm2

# 啟動服務
pm2 start apps/api/dist/main.js --name lomall-api
pm2 start apps/bot/dist/main.js --name lomall-bot
pm2 start apps/web/node_modules/.bin/next --name lomall-web -- start -p 3000

# 儲存行程列表
pm2 save
pm2 startup
```

## Systemd

亦可為各元件建立 systemd 服務。

### 範例：`/etc/systemd/system/lomall-api.service`

```ini
[Unit]
Description=Lomall API
After=network.target postgresql.service

[Service]
Type=simple
User=node
WorkingDirectory=/opt/lomall
ExecStart=/usr/bin/node apps/api/dist/main.js
Environment=NODE_ENV=production
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## 反向代理

使用 Nginx 或 Caddy 設定反向代理：

```nginx
# Nginx 設定範例
server {
    listen 80;
    server_name lomall.example.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
