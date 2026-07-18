# Builds a single app (APP_NAME) from the monorepo. Works for any workspace whose
# production bundle is produced by `vite build`. The runtime runs `node .`, so the
# app's package.json must declare both:
#   "main": pointing at its built server entry (e.g. "build/index.js")
#   "files": including the build output directory (e.g. "files": ["build"]),
#            otherwise `pnpm deploy` won't copy the bundle into the runtime image
FROM node:24.18.0-trixie-slim AS base
RUN corepack enable pnpm
WORKDIR /repo

# ---- Prune the monorepo down to just this app's dependency graph ----
FROM base AS pruner
ARG APP_NAME
COPY . .
RUN test -n "${APP_NAME}" || { echo "APP_NAME build arg is required" >&2; exit 1; }
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
RUN pnpm exec turbo run codegen --filter=@apps/$APP_NAME^...
RUN pnpm --filter=@apps/${APP_NAME} exec vite build
RUN pnpm --filter=@apps/${APP_NAME} deploy --legacy --prod out
# Fail the build if the deployed package can't be started with `node .` in the runtime
# stage: `main` must be declared and the file it points at must have been packed
RUN node -e "const p = require('/repo/out/package.json'); \
    if (!p.main) throw new Error('package.json needs a main field pointing at the built server entry'); \
    require('fs').accessSync('/repo/out/' + p.main)"

# ---- Minimal runtime ----
# Distroless publishes no Node patch-version tags, so pin by digest to keep the runtime
# Node version reproducible and in step with the builder image above.
FROM gcr.io/distroless/nodejs24-debian13@sha256:7a22f300e7bd7ec78f3db220fb679af4e169e5f3373f97fe432847111f9b1810 AS deployer
WORKDIR /app
ENV NODE_ENV=production
# Left root-owned deliberately: the app only reads its own files, and the nonroot
# runtime user must not be able to modify them
COPY --from=builder /repo/out/ .
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
# `node .` resolves the app's entry point from the `main` field of its package.json,
# so each app declares where its server entry lives instead of the Dockerfile
# assuming a fixed output path
CMD ["."]
