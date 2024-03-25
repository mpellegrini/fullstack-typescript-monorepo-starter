import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, mergeConfig } from 'vite'

import vitestSharedConfig from '@toolchain/vitest-config'

import packageJson from './package.json'

export default mergeConfig(
  vitestSharedConfig,
  defineConfig({
    plugins: [sveltekit()],
    test: {
      name: packageJson.name,
    },
  }),
)
