import { defineFlatConfig } from 'eslint-define-config'
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments'
import globals from 'globals'

const { es2021, nodeBuiltin } = globals
export default defineFlatConfig([
  {
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: true,
    },

    languageOptions: {
      // TODO: Should this be moved to each profile
      globals: {
        ...es2021,
        ...nodeBuiltin,
      },
    },
  },

  /**
   * eslint-plugin-eslint-comments configuration
   *
   * Additional ESLint rules for directive comments of ESLint.
   * https://github.com/mysticatea/eslint-plugin-eslint-comments
   */
  {
    plugins: {
      'eslint-comments': eslintCommentsPlugin,
    },
    rules: {
      ...eslintCommentsPlugin.configs.recommended.rules,

      /**
       * Require comments on ESLint disable directives.
       *
       * 🚫 Not fixable - https://mysticatea.github.io/eslint-plugin-eslint-comments/rules/require-description.html
       */
      'eslint-comments/require-description': 'error',
    },
  },
])
