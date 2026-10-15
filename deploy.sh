#!/bin/bash
set -e

cd /opt/ludoteca

echo "==> Pulling latest code..."
git pull origin main

echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

echo "==> Building frontend..."
pnpm --filter web build

echo "==> Building and starting containers..."
docker compose up -d --build

echo "==> Running migrations..."
sleep 5
cd /opt/ludoteca
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}" npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

echo "==> Healthcheck..."
sleep 3
curl -sf http://localhost:3000/api/health > /dev/null && echo "API is healthy!" || echo "WARNING: API healthcheck failed"

echo "==> Deploy complete!"