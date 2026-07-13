import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, mergeConfig } from 'vite'

import vitestSharedConfig from '@toolchain/vitest-config'

import packageJson from './package.json' with { type: 'json' }

export default mergeConfig(
  vitestSharedConfig,
  defineConfig({
    plugins: [sveltekit(), tailwindcss()],
    test: {
      name: packageJson.name,
    },
  }),
)
