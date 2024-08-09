import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-vitest'

/**
 * eslint-plugin-vitest configuration
 *
 * eslint plugin for vitest
 * https://github.com/veritem/eslint-plugin-vitest
 */
export default defineFlatConfig([
  {
    files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...plugin.environments.env.globals,
      },
    },
    plugins: {
      vitest: plugin,
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

      /**
       * Disallow .spec test file pattern.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/consistent-test-filename.md
       */
      'vitest/consistent-test-filename': ['error', { pattern: String.raw`.*\.test\.ts$` }],

      /**
       * Prefer test or it but not both.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-import-node-test.md
       */
      'vitest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],

      /**
       * Enforce a maximum number of expect per test.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/max-expects.md
       */
      'vitest/max-expects': ['error', { max: 10 }],

      /**
       * Nested describe block should be less than set max value or default value.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/max-nested-describe.md
       */
      'vitest/max-nested-describe': ['error', { max: 5 }],

      /**
       * Disallow alias methods.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-alias-methods.md
       */
      'vitest/no-alias-methods': 'error',

      /**
       * Disallow conditional expects
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-expect.md
       */
      'vitest/no-conditional-expect': 'error',

      /**
       * Disallow conditional tests.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-in-test.md
       */
      'vitest/no-conditional-in-test': 'error',

      /**
       * Disallow conditional tests.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-conditional-tests.md
       */
      'vitest/no-conditional-tests': 'error',

      /**
       * Disallow disabled tests.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-disabled-tests.md
       */
      'vitest/no-disabled-tests': 'error',

      /**
       * Disallow duplicate hooks and teardown hooks.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-duplicate-hooks.md
       */
      'vitest/no-duplicate-hooks': 'error',

      /**
       * Disallow focused tests.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-focused-tests.md
       */
      'vitest/no-focused-tests': 'error',

      /**
       * Disallow setup and teardown hooks
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-hooks.md
       */
      'vitest/no-hooks': 'off',

      /**
       * Disallow string interpolation in snapshots.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-interpolation-in-snapshots.md
       */
      'vitest/no-interpolation-in-snapshots': 'error',

      /**
       * Disallow large snapshots
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-large-snapshots.md
       */
      'vitest:no-large-snapshots': 'off',

      /**
       * Disallow importing from mocks directory.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-mocks-import.md
       */
      'vitest/no-mocks-import': 'error',

      /**
       * Disallow the use of certain matchers.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-restricted-matchers.md
       */
      'vitest/no-restricted-matchers': 'off',

      /**
       * Disallow specific vi. methods.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-restricted-vi-methods.md
       */
      'vitest/no-restricted-vi-methods': 'off',

      /**
       * Disallow using expect outside of it or test blocks.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-standalone-expect.md
       */
      'vitest/no-standalone-expect': 'error',

      /**
       * Disallow using test as a prefix.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-test-prefixes.md
       */
      'vitest/no-test-prefixes': 'off',

      /**
       * Disallow return statements in tests.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-test-return-statement.md
       */
      'vitest/no-test-return-statement': 'error',

      /**
       * Suggest using toBeCalledWith() or toHaveBeenCalledWith()
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-called-with.md
       */
      'vitest/prefer-called-with': 'error',

      /**
       * Suggest using the built-in comparison matchers.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-comparison-matcher.md
       */
      'vitest/prefer-comparison-matcher': 'error',

      /**
       * Prefer each rather than manual loops.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-each.md
       */
      'vitest/prefer-each': 'error',

      /**
       * Suggest using the built-in quality matchers.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-equality-matcher.md
       */
      'vitest/prefer-equality-matcher': 'error',

      /**
       * Suggest using expect assertions instead of callbacks.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-expect-assertions.md
       */
      'vitest/prefer-expect-assertions': 'error',

      /**
       * Suggest using expect().resolves over expect(await ...) syntax.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-expect-resolves.md
       */
      'vitest/prefer-expect-resolves': 'error',

      /**
       * Prefer having hooks in consistent order.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-hooks-in-order.md
       */
      'vitest/prefer-hooks-in-order': 'error',

      /**
       * Suggest having hooks before any test cases.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-hooks-on-top.md
       */
      'vitest/prefer-hooks-on-top': 'error',

      /**
       * Enforce lowercase titles.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-lowercase-title.md
       */
      'vitest/prefer-lowercase-title': 'error',

      /**
       * Prefer mock resolved/rejected shorthands for promises.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-mock-promise-shorthand.md
       */
      'vitest/prefer-mock-promise-shorthand': 'error',

      /**
       * Prefer including a hint with external snapshots.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-snapshot-hint.md
       */
      'vitest/prefer-snapshot-hint': 'error',

      /**
       * Suggest using vi.spyOn.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-spy-on.md
       */
      'vitest/prefer-spy-on': 'error',

      /**
       * Prefer strict equal over equal.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-strict-equal.md
       */
      'vitest/prefer-strict-equal': 'error',

      /**
       * Suggest using toBe()
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-to-be.md
       */
      'vitest/prefer-to-be': 'error',

      /**
       * Suggest using toBeFalsy().
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-to-be-falsy.md
       */
      'vitest/prefer-to-be-falsy': 'error',

      /**
       * Prefer toBeObject()
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-to-be-object.md
       */
      'vitest/prefer-to-be-object': 'error',

      /**
       * Suggest using toBeTruthy.
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-to-be-truthy.md
       */
      'vitest/prefer-to-be-truthy': 'error',

      /**
       * Prefer using toContain()
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-to-contain.md
       */
      'vitest/prefer-to-contain': 'error',

      /**
       * Suggest using toHaveLength().
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-to-have-length.md
       */
      'vitest/prefer-to-have-length': 'error',

      /**
       * Suggest using test.todo
       *
       * 🔧 Fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/prefer-todo.md
       */
      'vitest/prefer-todo': 'error',

      /**
       * Require setup and teardown to be within a hook.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/require-hook.md
       */
      'vitest/require-hook': 'error',

      /**
       * Require toThrow() to be called with an error message.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/require-to-throw-message.md
       */
      'vitest/require-to-throw-message': 'error',

      /**
       * Enforce that all tests are in a top-level describe.
       *
       * 🚫 Not fixable - https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/require-top-level-describe.md
       */
      'vitest/require-top-level-describe': 'error',
    },
  },
])
