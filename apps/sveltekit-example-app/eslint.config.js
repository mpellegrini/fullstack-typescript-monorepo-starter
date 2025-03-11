import config from '@toolchain/eslint-config/profile/svelte'

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
    rules: {
      // TODO: Once settled this config must be moved to @toolchain/eslint-config
      // Turning these off as they currently interfere with SvelteKit 5
      // '@typescript-eslint/explicit-module-boundary-types': 'off',
      // '@typescript-eslint/no-unsafe-argument': 'off',
      // '@typescript-eslint/no-unsafe-assignment': 'off',
      // '@typescript-eslint/no-unsafe-call': 'off',
      // '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
]
