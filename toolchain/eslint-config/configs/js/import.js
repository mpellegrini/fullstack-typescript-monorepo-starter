import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-import'

/**
 * eslint-plugin-import configuration
 *
 * ESLint plugin with rules that help validate proper imports.
 * https://github.com/import-js/eslint-plugin-import
 */
export default defineFlatConfig({
  plugins: {
    import: plugin,
  },
  settings: {
    // see https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1419518561
    'import/parsers': {
      espree: ['.js', '.cjs', '.mjs', '.jsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.cjs', '.mjs', '.jsx'],
      },
      typescript: true,
    },
    'import/internal-regex': '^@(apps|packages|toolchain|serverless|infrastructure)/',
  },
  rules: {
    ...plugin.configs.recommended.rules,

    /**
     * Disallow non-import statements appearing before import statements.
     *
     * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
     */
    'import/first': 'error',

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: false,
        },
      },
    ],
  },
})
