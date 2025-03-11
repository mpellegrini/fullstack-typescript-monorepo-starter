import plugin from 'eslint-plugin-svelte'
import { config, parser } from 'typescript-eslint'

import typescriptConfig from './typescript.js'

export default config(
  {
    extends: [typescriptConfig],
    files: ['**/*.svelte'],
    rules: {
      'svelte/block-lang': ['error', { script: 'ts', style: ['postcss', 'css'] }],
      'svelte/max-attributes-per-line': 'error',
      'svelte/sort-attributes': 'error',
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'], // Add support for additional file extensions, such as .svelte
        parser: parser,
        projectService: true,
      },
    },
  },
  ...plugin.configs.recommended,
)
