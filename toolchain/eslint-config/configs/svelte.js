import plugin from 'eslint-plugin-svelte'
import { config, parser } from 'typescript-eslint'

import typescriptConfig from './typescript.js'

/**
 * eslint-plugin-svelte
 *
 * ESLint plugin for Svelte using AST
 * https://github.com/sveltejs/eslint-plugin-svelte
 */
export default config(
  ...plugin.configs.recommended,
  {
    extends: [typescriptConfig],
    files: ['**/*.svelte'],
    rules: {
      'svelte/block-lang': ['error', { script: 'ts', style: ['postcss', 'css'] }],
      'svelte/sort-attributes': 'error',
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        parser: parser,
        projectService: true,
      },
    },
  },
  ...plugin.configs.prettier,
)
