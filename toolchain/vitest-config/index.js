import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    passWithNoTests: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      all: true,
      reportsDirectory: 'coverage',
      reporter: ['text', 'json', 'html'],
    },
  },
})

export { defineConfig, mergeConfig } from 'vitest/config'
