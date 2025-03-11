import plugin from 'eslint-plugin-eslint-comments'
import { config } from 'typescript-eslint'

/**
 * eslint-plugin-eslint-comments configuration
 *
 * Additional ESLint rules for directive comments of ESLint.
 * https://github.com/mysticatea/eslint-plugin-eslint-comments
 */
export default config({
  name: 'eslint-config:config:eslint-comments',

  plugins: {
    'eslint-comments': plugin,
  },
  rules: {
    ...plugin.configs.recommended.rules,

    /**
     * Require comments on ESLint disable directives.
     *
     * 🚫 Not fixable - https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/require-description.html
     */
    'eslint-comments/require-description': 'error',
  },
})
