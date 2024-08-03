FROM node:20-bookworm-slim AS build

RUN corepack enable

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm -w run build
RUN pnpm --filter=@apps/sveltekit-example-app exec vite build
RUN pnpm --filter=@apps/sveltekit-example-app deploy --prod out

FROM gcr.io/distroless/nodejs20-debian12

ENV NODE_ENV=production
ENV ORIGIN=http://localhost:8080

WORKDIR /app

COPY --from=build /app/out/ .

EXPOSE 8080
CMD ["build"]
