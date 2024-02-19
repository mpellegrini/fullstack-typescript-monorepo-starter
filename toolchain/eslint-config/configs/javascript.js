import js from '@eslint/js'
import { defineFlatConfig } from 'eslint-define-config'

import importConfig from './js/import.js'
import promiseConfig from './js/promise.js'

export default defineFlatConfig([
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      ...js.configs.recommended.rules,

      /**
       * Disallow empty functions.
       *
       * 🚫 Not fixable - https://eslint.org/docs/latest/rules/no-empty-function
       */
      'no-empty-function': 'error',
    },
  },
  importConfig,
  promiseConfig,
])
