import plugin from 'eslint-plugin-unicorn'
import { config } from 'typescript-eslint'

/**
 * eslint-plugin-unicorn configuration
 *
 * More than 100 powerful ESLint rules.
 * https://github.com/sindresorhus/eslint-plugin-unicorn
 */
export default config(plugin.configs.recommended, {
  name: 'eslint-config:config:js:unicorn',

  rules: {
    /**
     * Use destructured variables over properties.
     *
     * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md
     *
     */
    'unicorn/consistent-destructuring': ['error'],

    /**
     * Enforce correct Error subclassing.
     *
     * 🔧 Partially Fixable  - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/custom-error-definition.md
     *
     */
    'unicorn/custom-error-definition': ['error'],

    // Turn off the following recommended rules
    'unicorn/no-array-reduce': ['off'],
    'unicorn/no-null': ['off'],
    'unicorn/prevent-abbreviations': ['off'],
  },
})
