import js from '@eslint/js'
import { defineFlatConfig } from 'eslint-define-config'

import importConfig from './js/import.js'
import perfectionistConfig from './js/perfectionist.js'
import promiseConfig from './js/promise.js'
import unicornConfig from './js/unicorn.js'

export default defineFlatConfig([
  {
    languageOptions: {
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      sourceType: 'module',
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
  perfectionistConfig,
  promiseConfig,
  unicornConfig,
])
