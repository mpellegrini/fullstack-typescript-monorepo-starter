import config from '@toolchain/eslint-config/profile/svelte'

import svelteConfig from './svelte.config.js'

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
      'perfectionist/sort-named-exports': 'off',
      'unicorn/prefer-export-from': 'off',
    },
  },
]
