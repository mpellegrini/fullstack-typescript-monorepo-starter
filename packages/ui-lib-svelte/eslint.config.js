import config from '@toolchain/eslint-config/profile/svelte'

export default [
  ...config,
  {
    // TODO: Once settled this config must be moved to @toolchain/eslint-config
    files: ['**/*.svelte', '**/*.svelte.ts'],
    rules: {
      // Turning these off as they currently interfere with SvelteKit 5
    },
  },
]
