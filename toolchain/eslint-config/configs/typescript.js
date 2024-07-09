import parser from '@typescript-eslint/parser'
import { defineFlatConfig } from 'eslint-define-config'

import baseTypeScriptConfig, { TYPESCRIPT_FILES } from './ts/base.js'
import deprecationConfig from './ts/deprecation.js'
import typescriptImportConfig from './ts/import.js'

export default defineFlatConfig([
  {
    files: TYPESCRIPT_FILES,
    languageOptions: {
      parser: parser,
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: TYPESCRIPT_FILES,
    ...baseTypeScriptConfig,
  },
  {
    files: TYPESCRIPT_FILES,
    ...typescriptImportConfig,
  },
  {
    files: TYPESCRIPT_FILES,
    ...deprecationConfig,
  },
])
