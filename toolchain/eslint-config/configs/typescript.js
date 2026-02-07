import { config, configs } from 'typescript-eslint'

import importConfig from './ts/import.js'

export default config(
  //
  importConfig,
  {
    name: 'eslint-config:config:typescript',

    extends: [configs.recommendedTypeChecked, configs.stylisticTypeChecked],
    files: ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: true,
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      // '@typescript-eslint/no-deprecated': 'error', // TODO - Re-enable once update to plugin to support ESLint 10.0.0 is released
      '@typescript-eslint/consistent-generic-constructors': 'off', // TODO - Re-enable once update to plugin to support ESLint 10.0.0 is released
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          classes: false,
          functions: false,
          variables: true,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          requireDefaultForNonUnion: true,
        },
      ],

      '@typescript-eslint/no-require-imports': 'error',
    },
  },
)
