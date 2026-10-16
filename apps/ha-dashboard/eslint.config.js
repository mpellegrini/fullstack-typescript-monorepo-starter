import { loadConfig } from '@sveltejs/load-config'

import config from '@toolchain/eslint/profile/svelte'

const loaded = await loadConfig('./', { traverse: false })
const svelteConfig = loaded?.config

export default [
  ...config,
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        svelteConfig,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/dot-notation': 'off',
    },
  },
]
