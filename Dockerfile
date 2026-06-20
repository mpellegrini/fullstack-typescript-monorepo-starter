FROM node:24.15.0-trixie-slim AS base
RUN corepack enable pnpm
WORKDIR /repo

# ---- Prune the monorepo down to just this app's dependency graph ----
FROM base AS pruner
ARG APP_NAME
COPY . .
RUN TURBO_VERSION=$(node -p "require('./package.json').devDependencies.turbo") && \
    pnpm dlx turbo@${TURBO_VERSION} prune @apps/${APP_NAME} --docker

# ---- Install deps & build using only the pruned subset ----
FROM base AS builder
ARG APP_NAME
# Lockfile + package.json skeleton first for layer caching
COPY --link --from=pruner /repo/out/json/ .
ENV PNPM_STORE_DIR=/pnpm/store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
# Now the actual source
COPY --link --from=pruner /repo/out/full/ .
RUN pnpm exec turbo run build --filter=@apps/$APP_NAME^...
RUN pnpm --filter=@apps/${APP_NAME} exec vite build
RUN pnpm --filter=@apps/${APP_NAME} deploy --legacy --prod out

# ---- Minimal runtime ----
FROM gcr.io/distroless/nodejs24-debian13 AS deployer
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=nonroot:nonroot --from=builder /repo/out/ .
USER nonroot

ARG APP_NAME=unknown
ARG VERSION=unknown
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown
ENV APP_NAME=${APP_NAME} \
    VCS_REF=${VCS_REF} \
    BUILD_DATE=${BUILD_DATE} \
    VERSION=${VERSION}

EXPOSE 3000
ENV PORT=3000
CMD ["build"]
