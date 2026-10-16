import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, mergeConfig } from 'vite'

import { defineTestConfig } from '@toolchain/vitest'

import packageJson from './package.json' with { type: 'json' }

export default mergeConfig(
  defineTestConfig(packageJson),
  defineConfig({
    plugins: [
      sveltekit({
        compilerOptions: {
          runes: true,
        },

        // Consult https://kit.svelte.dev/docs/integrations#preprocessors
        // for more information about preprocessors
        preprocess: vitePreprocess(),

        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: adapter(),
      }),
      tailwindcss(),
    ],
  }),
)
