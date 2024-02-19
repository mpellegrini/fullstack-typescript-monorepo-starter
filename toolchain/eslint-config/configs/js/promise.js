import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-promise'

/**
 * eslint-plugin-promise configuration
 *
 * Enforce best practices for JavaScript promises.
 * https://github.com/eslint-community/eslint-plugin-promise
 */
export default defineFlatConfig({
  plugins: {
    promise: plugin,
  },
  rules: {
    ...plugin.configs.recommended.rules,
  },
})
