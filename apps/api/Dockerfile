# ── Stage 1: build ──────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Сначала копируем только файлы зависимостей — для кэширования слоёв.
# Если package.json не менялся, Docker переиспользует кэш и не будет
# заново ставить все пакеты при каждом билде.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/types/package.json packages/types/

RUN pnpm install --frozen-lockfile

# Теперь копируем исходники
COPY apps/api/ apps/api/
COPY packages/types/ packages/types/
COPY tsconfig.base.json ./

# Генерируем Prisma client и собираем API
RUN pnpm --filter api prisma generate
RUN pnpm --filter api build

# ── Stage 2: production ─────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/types/package.json packages/types/

RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/generated apps/api/generated
COPY --from=build /app/apps/api/prisma apps/api/prisma

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]