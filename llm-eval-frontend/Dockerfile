# 1. Build-Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Abhängigkeiten installieren
COPY package.json package-lock.json ./
RUN npm ci

# Restliche Projektdateien kopieren & Build ausführen
COPY . .
RUN yarn build

# 2. Run-Phase (Production Image)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Nur das Nötigste übernehmen
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]