// @ts-check
import { defineConfig, mergeConfig } from 'vitest/config'

/**
 * Shared vitest config, named after the workspace it runs in so reporters can tell
 * projects apart.
 *
 * @param {{ name: string }} packageJson the workspace's package.json
 * @param {import('vitest/config').ViteUserConfig} [overrides] merged last, so it wins over the shared settings
 * @returns {import('vitest/config').ViteUserConfig}
 */
export const defineTestConfig = (packageJson, overrides = {}) =>
  mergeConfig(
    defineConfig({
      test: {
        name: packageJson.name,
        include: ['src/**/*.test.ts'],
        globals: true,
        passWithNoTests: true,
        coverage: {
          enabled: true,
          provider: 'v8',
          include: ['src/**/*.{ts,svelte}'],
          reportsDirectory: './coverage',
          reporter: ['json', 'json-summary'],
          reportOnFailure: true,
          skipFull: true,
        },
      },
    }),
    overrides,
  )

export { defineConfig, mergeConfig } from 'vitest/config'
