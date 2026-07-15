# Self-Hosting

Deploy Lomall on your own infrastructure.

## Production Build

```bash
# Install dependencies
npm install

# Build shared package
npm run build:shared

# Build all applications
npm run build:api
npm run build:bot
npm run build:web
```

## Running with Process Manager

We recommend using [PM2](https://pm2.keymetrics.io/):

```bash
npm install -g pm2

# Start services
pm2 start apps/api/dist/main.js --name lomall-api
pm2 start apps/bot/dist/main.js --name lomall-bot
pm2 start apps/web/node_modules/.bin/next --name lomall-web -- start -p 3000

# Save process list
pm2 save
pm2 startup
```

## Systemd

Alternatively, create systemd service files for each component.

### Example: `/etc/systemd/system/lomall-api.service`

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

## Reverse Proxy

Use Nginx or Caddy as a reverse proxy:

```nginx
# Nginx configuration
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
