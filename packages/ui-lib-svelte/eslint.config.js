import { loadConfig } from '@sveltejs/load-config'

import config from '@toolchain/eslint/profile/svelte'

const { config: svelteConfig } = (await loadConfig('./', { traverse: false })) ?? {}

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
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      'perfectionist/sort-named-exports': 'off',
      'unicorn/prefer-export-from': 'off',
    },
  },
]
