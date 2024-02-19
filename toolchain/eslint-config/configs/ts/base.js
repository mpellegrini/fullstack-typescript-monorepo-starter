import plugin from '@typescript-eslint/eslint-plugin'
import { defineFlatConfig } from 'eslint-define-config'

export const TYPESCRIPT_FILES = ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx']

export default defineFlatConfig({
  plugins: {
    '@typescript-eslint': plugin,
  },
  rules: {
    ...plugin.configs['eslint-recommended'].overrides[0].rules,
    ...plugin.configs['recommended-type-checked'].rules,
    ...plugin.configs['stylistic-type-checked'].rules,

    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
      },
    ],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
})
