import sharedConfig, { defineConfig, mergeConfig } from '@toolchain/vitest-config'

import packageJson from './package.json'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: packageJson.name,
    },
  }),
)
