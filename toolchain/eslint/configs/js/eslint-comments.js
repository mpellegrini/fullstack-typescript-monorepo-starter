import plugin from '@eslint-community/eslint-plugin-eslint-comments/configs'
import { defineConfig } from 'eslint/config'

/**
eslint-plugin-eslint-comments configuration

Additional ESLint rules for directive comments of ESLint.
https://github.com/eslint-community/eslint-plugin-eslint-comments
*/
export default defineConfig(
  //
  plugin.recommended,
  {
    name: 'eslint-config:config:eslint-comments',
    rules: {
      /**
      Require descriptions in ESLint directive-comments
      🚫 Not fixable - https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/require-description.html
      */
      '@eslint-community/eslint-comments/require-description': 'error',
    },
  },
)
