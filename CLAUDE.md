# CLAUDE.md

This file provides guidance for Claude Code when working in this repository.

## Project Overview

Fullstack TypeScript monorepo starter using PNPM workspaces and Turborepo.

## Tech Stack

- **Runtime:** Node.js >= 24.11
- **Package Manager:** PNPM 10 (via Corepack)
- **Monorepo:** Turborepo
- **Language:** TypeScript 5.9 (ESM throughout)
- **Backend:** Effect Platform
- **Frontend:** SvelteKit 2, Svelte 5, Tailwind CSS 4
- **Database:** Drizzle ORM + PostgreSQL
- **Testing:** Vitest 4
- **Build:** Vite 7

## Workspace Structure

```
apps/           # Applications
  agentic-ai-example-app    # SvelteKit + Vercel AI SDK
  effect-api-server          # Effect Platform API server
  effect-platform-fundamentals
  ha-dashboard               # Home Assistant dashboard (SvelteKit)
  sveltekit-example-app      # SvelteKit example app

packages/       # Shared libraries
  api              # Effect Platform HttpApi definitions
  api-impl         # API implementations with DB integration
  aws-cdk-lib      # AWS CDK infrastructure
  db-drizzlepg     # Drizzle ORM + PostgreSQL client
  example-pkg      # Template/example package
  ui-lib-svelte    # Reusable Svelte UI components

toolchain/      # Shared dev configuration
  eslint-config      # ESLint 10 config (Node + Svelte profiles)
  typescript-config  # TypeScript configs (Node 22+, Svelte)
  vitest-config      # Vitest config with coverage
```

## Common Commands

```bash
pnpm build          # Build all packages (turbo)
pnpm test           # Run all tests (turbo)
pnpm lint           # Lint all packages (turbo)
pnpm typecheck      # Type-check all packages (turbo)
pnpm format         # Format all files (prettier)
pnpm clean          # Clean build artifacts
```

To run commands for a specific workspace:

```bash
pnpm --filter @apps/sveltekit-example-app dev
pnpm --filter @packages/api build
```

## Turbo Task Dependencies

- `lint`, `test`, and `typecheck` all depend on `build` completing first
- `build` depends on upstream workspace `build` tasks (`^build`)

## Code Style

- **Prettier** is the formatter (runs via lint-staged pre-commit hook)
  - `printWidth: 100`, single quotes, no semicolons, trailing commas
  - Plugins: packagejson, svelte, tailwindcss
- **ESLint 10** with TypeScript, Svelte, import, unicorn, and perfectionist plugins
- Workspace naming: apps use `@apps/` prefix, packages use `@packages/`, toolchain uses `@toolchain/`

## Git Workflow

- **Never commit directly to `main`.** All work must be done on feature branches.
- Create a descriptive branch name: `feat/short-description`, `fix/short-description`, `chore/short-description`, etc.
- When work is ready, submit a pull request to `main` for review.
- Always ensure `lint`, `typecheck`, and `test` pass before opening a PR.

## Commit Conventions

Conventional Commits enforced via commitlint. Subject must be lowercase.

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

Format: `type(scope): lowercase description`

Examples:
- `feat(api): add user endpoint`
- `fix(db): resolve connection pool leak`
- `chore(monorepo): update dependencies`

## Dependency Management

- **one-version** enforces consistent dependency versions across the monorepo (pin strategy)
- Dependencies that only need to be built are listed in `pnpm.onlyBuiltDependencies`

## Key Patterns

- All packages use ESM (`"type": "module"`)
- Effect is used for functional error handling and dependency injection in API packages
- Drizzle ORM provides type-safe database access
- SvelteKit apps use Tailwind CSS 4 for styling
- Shared UI components live in `@packages/ui-lib-svelte`
