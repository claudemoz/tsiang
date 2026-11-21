# syntax=docker/dockerfile:1

# ---- Dépendances ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Les variables NEXT_PUBLIC_* sont figées dans le bundle au build : les passer avec --build-arg.
ARG NEXT_PUBLIC_CALENDLY_URL=""
ARG NEXT_PUBLIC_CALCOM_URL=""
ARG NEXT_PUBLIC_BOOKING_PROVIDER="calendly"
ENV NEXT_PUBLIC_CALENDLY_URL=$NEXT_PUBLIC_CALENDLY_URL \
    NEXT_PUBLIC_CALCOM_URL=$NEXT_PUBLIC_CALCOM_URL \
    NEXT_PUBLIC_BOOKING_PROVIDER=$NEXT_PUBLIC_BOOKING_PROVIDER \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# Lues côté serveur au runtime (lib/activity.ts) : GITLAB_TOKEN, GITLAB_URL, GITLAB_USERNAME,
# GITHUB_TOKEN, GITHUB_USERNAME. À fournir via l'environnement (docker run --env-file).
CMD ["node", "server.js"]

# docker buildx build --platform linux/amd64 -t tsiang/portfolio .
# docker push tsiang/portfolio:latest

# docker compose build app  
# docker compose push app 
