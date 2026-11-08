# syntax=docker/dockerfile:1
# Build multi-stage para apps/api. Contexto de build: raíz del monorepo
# (necesario para resolver el workspace de pnpm). Ver docker-compose.yml.

FROM node:22.22.3-alpine AS base
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@10.20.0 --activate

FROM base AS build
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
RUN pnpm --filter api build

FROM base AS prod-deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile --prod

FROM node:22.22.3-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /repo/node_modules ./node_modules
COPY --from=prod-deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY apps/api/package.json ./apps/api/package.json
USER node
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
