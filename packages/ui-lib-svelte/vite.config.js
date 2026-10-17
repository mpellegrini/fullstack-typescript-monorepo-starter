import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, mergeConfig } from 'vite'

import { defineTestConfig } from '@toolchain/vitest'

import packageJson from './package.json' with { type: 'json' }

const config = mergeConfig(
  defineTestConfig(packageJson),
  defineConfig({
    plugins: [
      sveltekit({
        // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        adapter: adapter(),
      }),
      tailwindcss(),
    ],
  }),
)

export default config
