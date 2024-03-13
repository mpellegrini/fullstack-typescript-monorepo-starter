// eslint-disable-next-line import/no-extraneous-dependencies -- (as designed, vite is hoisted and available globally)
import { defineConfig, mergeConfig } from 'vitest/config'

import sharedConfig from '@toolchain/vitest-config'

import packageJson from './package.json'

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      name: packageJson.name,
    },
  }),
)
