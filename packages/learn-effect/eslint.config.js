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
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-method-this-argument': 'off',
      'unicorn/throw-new-error': 'off',

      /**
       * The code problem checked by this ESLint rule is automatically checked by
       * the TypeScript compiler. Thus, it is not recommended to turn on this rule
       * in new TypeScript projects. You only need to enable this rule if you prefer
       * the ESLint error messages over the TypeScript compiler error messages.
       */
      '@typescript-eslint/no-redeclare': 'off',
    },
  },
]
