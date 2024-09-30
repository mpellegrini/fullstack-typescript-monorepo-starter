import { sveltekit } from '@sveltejs/kit/vite'
import { createRequire } from 'node:module'
import { defineConfig, mergeConfig } from 'vite'

import vitestSharedConfig from '@toolchain/vitest-config'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json')

export default mergeConfig(
  vitestSharedConfig,
  defineConfig({
    plugins: [sveltekit()],
    test: {
      name: packageJson.name,
    },
  }),
)
