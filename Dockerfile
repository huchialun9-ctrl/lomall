FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/bot/package.json apps/bot/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY prisma/ prisma/

RUN npm ci

COPY . .

RUN npx prisma generate && npm run build -w packages/shared && npm run build -w apps/api

EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
