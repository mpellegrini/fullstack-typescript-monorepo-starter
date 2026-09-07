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
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
    },
  },
]
