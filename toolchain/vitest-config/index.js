// @ts-check
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    passWithNoTests: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**'],
      reportsDirectory: './coverage',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportOnFailure: true,
      skipFull: true,
    },
  },
})

export { defineConfig, mergeConfig } from 'vitest/config'
