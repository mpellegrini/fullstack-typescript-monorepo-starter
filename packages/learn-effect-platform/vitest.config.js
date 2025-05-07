import { createRequire } from 'node:module'

import sharedConfig, { defineConfig, mergeConfig } from '@toolchain/vitest-config'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json')

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: packageJson.name,
    },
  }),
)
