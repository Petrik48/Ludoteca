#!/bin/bash
set -euo pipefail

cd /opt/ludoteca

echo "==> Installing dependencies..."
CI=true pnpm install --frozen-lockfile

echo "==> Building frontend..."
pnpm --filter web build

echo "==> Building and starting containers..."
docker compose up -d --build

echo "==> Running migrations..."
set -a
source /opt/ludoteca/.env
set +a
export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"
pnpm --filter api exec -- prisma migrate deploy --schema=prisma/schema.prisma

echo "==> Healthcheck..."
for attempt in $(seq 1 15); do
  if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "API is healthy (attempt ${attempt})"
    echo "==> Deploy complete!"
    exit 0
  fi
  sleep 2
done

echo "ERROR: API did not become healthy in 30s" >&2
docker compose logs api --tail 30 >&2
exit 1