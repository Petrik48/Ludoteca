FROM node:22-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/types/package.json packages/types/

RUN pnpm install --frozen-lockfile

COPY apps/api/ apps/api/
COPY packages/types/ packages/types/
COPY tsconfig.base.json ./

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm --filter api prisma:generate
RUN pnpm --filter api build

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]