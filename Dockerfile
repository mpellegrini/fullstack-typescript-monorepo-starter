FROM node:20.17.0-bookworm-slim AS builder

ARG APP_NAME

RUN corepack enable
WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm exec turbo build --filter=@apps/$APP_NAME^...

RUN pnpm --filter=@apps/$APP_NAME exec vite build
RUN pnpm --filter=@apps/$APP_NAME deploy --prod out

FROM gcr.io/distroless/nodejs20-debian12 AS deployer

ENV NODE_ENV=production
ENV ORIGIN=http://localhost:8080

WORKDIR /app

COPY --chown=nonroot:nonroot --from=builder /app/out/ .

USER nonroot
CMD ["build"]
