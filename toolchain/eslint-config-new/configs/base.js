import globals from 'globals'
import { config } from 'typescript-eslint'

import eslintCommentsConfig from './js/eslint-comments.js'

const { builtin } = globals

export default config(
  {
    name: 'eslint-config:config:base',

    languageOptions: {
      ecmaVersion: 2025,
      globals: {
        ...builtin,
      },
      parserOptions: {
        ecmaVersion: 2025,
        sourceType: 'module',
      },
      sourceType: 'module',
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },
  eslintCommentsConfig,
)
