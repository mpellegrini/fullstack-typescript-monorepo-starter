import typescriptParser from '@typescript-eslint/parser'
import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'

import baseTypeScriptConfig, { TYPESCRIPT_FILES } from './ts/base.js'
import typescriptImportConfig from './ts/import.js'

const SVELTE_FILES = ['**/*.svelte']

export default defineFlatConfig([
  {
    files: TYPESCRIPT_FILES,
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
    },
  },

  {
    files: SVELTE_FILES,
    ...baseTypeScriptConfig,
  },

  {
    files: SVELTE_FILES,
    ...typescriptImportConfig,
  },

  {
    files: SVELTE_FILES,
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptParser,
        project: true,
        extraFileExtensions: ['.svelte'],
      },
    },
    processor: 'svelte/svelte',
    plugins: {
      svelte: plugin,
    },
    rules: {
      ...plugin.configs.base.overrides[0].rules,
      ...plugin.configs.recommended.rules,

      'svelte/block-lang': ['error', { script: 'ts', style: ['postcss', 'css'] }],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|\\${2}(Props|Slots|Events)',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      /**
       * Overrides rule defined in ./js/imports.js
       *
       * Svelte v4 requires mutable exports to work correctly for component props
       * Revisit when upgrading to Svelte v5 and Runes
       */
      'import/no-mutable-exports': 'off',
    },
  },
  {
    ignores: ['.svelte-kit', 'build', '$houdini'],
  },
])
