import globals from 'globals'
import { config } from 'typescript-eslint'

import baseConfig from '../configs/base.js'
import globalIgnoresConfig from '../configs/global-ignores.js'
import javascriptConfig from '../configs/javascript.js'
import prettierConfig from '../configs/prettier.js'
import svelteConfig from '../configs/svelte.js'
import typescriptConfig from '../configs/typescript.js'
import vitestConfig from '../configs/vitest.js'

const { browser, nodeBuiltin } = globals

export default config(
  javascriptConfig,
  typescriptConfig,
  svelteConfig,
  vitestConfig,
  baseConfig,
  prettierConfig,
  globalIgnoresConfig,
  {
    name: 'eslint-config:profile:svelte',

    languageOptions: {
      globals: {
        ...browser,
        ...nodeBuiltin,
      },
    },
  },
)
