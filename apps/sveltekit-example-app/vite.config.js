import { sveltekit } from '@sveltejs/kit/vite'
// eslint-disable-next-line import/no-extraneous-dependencies -- (as designed, vite is hoisted and available globally)
import { defineConfig, mergeConfig } from 'vitest/config'

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
