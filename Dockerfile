FROM node:20-bookworm-slim AS builder

ARG APP_NAME

RUN corepack enable
WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm run build --filter=...@apps/$APP_NAME

RUN pnpm --filter=@apps/$APP_NAME exec vite build
RUN pnpm --filter=@apps/$APP_NAME deploy --prod out

FROM gcr.io/distroless/nodejs20-debian12 AS deplpyer

ENV NODE_ENV=production
ENV ORIGIN=http://localhost:8080

WORKDIR /app

COPY --from=builder /app/out/ .

EXPOSE 8080
CMD ["build"]
