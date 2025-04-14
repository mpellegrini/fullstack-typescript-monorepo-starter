import config from '@toolchain/eslint-config/profile/node'

export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'unicorn/throw-new-error': 'off',
    },
  },
]
