import config from '@toolchain/eslint-config-new/profile/svelte'

import svelteConfig from './svelte.config.js'

delete svelteConfig.kit.typescript.config

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
]
