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
       * Enforce sorted import declarations within modules.
       *
       * 🔧 Fixable - https://eslint.org/docs/latest/rules/sort-imports
       */
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],

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
