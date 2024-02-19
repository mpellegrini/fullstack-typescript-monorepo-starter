import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-vitest'

export default defineFlatConfig([
  {
    files: ['**/*.test.ts'],
    plugins: {
      vitest: plugin,
    },
    languageOptions: {
      globals: {
        ...plugin.environments.env.globals,
      },
    },
    rules: {
      /**
       * Enforce having expectation in test body.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/expect-expect.md
       */
      'vitest/expect-expect': 'error',

      /**
       * Disallow identical titles.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-identical-title.md
       */
      'vitest/no-identical-title': 'error',

      /**
       * Disallow commented out tests
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-commented-out-tests.md
       */
      'vitest/no-commented-out-tests': 'error',

      /**
       * Enforce valid titles.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/valid-title.md
       */
      'vitest/valid-title': 'error',

      /**
       * Enforce valid expect() usage.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/valid-expect.md
       */
      'vitest/valid-expect': ['error', { alwaysAwait: true }],

      /**
       * Enforce valid describe callback.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/valid-describe-callback.md
       */
      'vitest/valid-describe-callback': 'error',

      /**
       * Require local Test Context for concurrent snapshot tests.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/require-local-test-context-for-concurrent-snapshots.md
       */
      'vitest/require-local-test-context-for-concurrent-snapshots': 'error',

      /**
       * Disallow importing node:test.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-import-node-test.md
       */
      'vitest/no-import-node-test': 'error',
    },
  },
])
