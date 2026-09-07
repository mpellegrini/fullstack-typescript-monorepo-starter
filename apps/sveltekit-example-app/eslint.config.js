import config from '@toolchain/eslint/profile/svelte'

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
      'unicorn/no-array-method-this-argument': 'off',
    },
  },
]
