import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-unicorn'

export default defineFlatConfig({
  plugins: {
    unicorn: plugin,
  },
  rules: {
    ...plugin.configs['flat/recommended'].rules,

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
