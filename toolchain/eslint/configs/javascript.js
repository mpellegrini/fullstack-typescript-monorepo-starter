import js from '@eslint/js'
import { config } from 'typescript-eslint'

import importConfig from './js/import.js'
import perfectionistConfig from './js/perfectionist.js'
import preferArrowConfig from './js/prefer-arrow.js'
import promiseConfig from './js/promise.js'
import unicornConfig from './js/unicorn.js'

export default config(
  js.configs.recommended,
  //
  importConfig,
  perfectionistConfig,
  preferArrowConfig,
  promiseConfig,
  unicornConfig,
  {
    name: 'eslint-config:config:javascript',

    rules: {
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
)
