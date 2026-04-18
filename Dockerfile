# syntax=docker/dockerfile:1
#
# Next.js web container (pairs with MongoDB container).
# Build/run from project root:
#   docker compose up --build

FROM node:20-bookworm-slim AS deps
WORKDIR /app

# One glob: copies package.json and package-lock.json when present (no separate optional pattern)
COPY package*.json ./

RUN set -eux; if [ -f package-lock.json ]; then npm ci || npm ci --legacy-peer-deps; else echo "WARNING: no package-lock.json; using npm install"; npm install; fi

# --- Build ---
FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# --- Production runner ---
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
