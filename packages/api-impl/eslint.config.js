import config from '@toolchain/eslint/profile/node'

export default [
  ...config,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'unicorn/no-array-callback-reference': 'off',
    },
  },
]
