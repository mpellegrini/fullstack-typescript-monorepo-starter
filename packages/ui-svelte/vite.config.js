// eslint-disable-next-line import/named -- not sure why yet
import { HstSvelte } from '@histoire/plugin-svelte'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig, mergeConfig } from 'vite'

import vitestSharedConfig from '@toolchain/vitest-config'

import packageJson from './package.json'

export default mergeConfig(
  vitestSharedConfig,
  defineConfig({
    histoire: {
      setupFile: './histoire-setup.js',
      plugins: [HstSvelte()],
    },
    plugins: [svelte()],
    test: {
      name: packageJson.name,
    },
  }),
)
