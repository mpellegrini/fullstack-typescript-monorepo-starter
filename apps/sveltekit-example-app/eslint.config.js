import config from '@toolchain/eslint-config/profile/svelte'

export default [
  ...config,
  {
    // TODO: Once settled this config must be moved to @toolchain/eslint-config
    files: ['**/*.svelte', '**/*.svelte.ts'],
    rules: {
      // Turning these off as they currently interfere with SvelteKit 5
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
]
