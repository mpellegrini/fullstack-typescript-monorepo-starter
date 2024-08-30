import js from '@eslint/js'
import { defineFlatConfig } from 'eslint-define-config'

import importConfig from './js/import.js'
import perfectionistConfig from './js/perfectionist.js'
import preferArrow from './js/prefer-arrow.js'
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

      /**
       * Require braces around arrow function bodies.
       *
       * 🔧 Fixable - https://eslint.org/docs/latest/rules/arrow-body-style
       */
      'arrow-body-style': ['error', 'as-needed'],

      /**
       * Enforce the consistent use of either function declarations or expressions
       * assigned to variables.
       *
       * 🔧 Fixable - https://eslint.org/docs/latest/rules/func-style
       */
      'func-style': ['error', 'expression'],

      'prefer-arrow-callback': 'error',

      'no-duplicate-imports': 'error',

      'prefer-const': ['error', { destructuring: 'all' }],
    },
  },
  importConfig,
  perfectionistConfig,
  promiseConfig,
  unicornConfig,
  preferArrow,
])
