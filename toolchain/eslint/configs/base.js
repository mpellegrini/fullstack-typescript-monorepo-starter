import { config } from 'typescript-eslint'

import eslintCommentsConfig from './js/eslint-comments.js'
import turborepo from './turborepo.js'

export default config(
  {
    name: 'eslint-config:config:base',

    languageOptions: {
      ecmaVersion: 2025,
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
  turborepo,
)
