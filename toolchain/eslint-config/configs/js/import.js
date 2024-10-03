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
  rules: {
    ...plugin.configs.recommended.rules,

    /**
     * Disallow non-import statements appearing before import statements.
     *
     *  https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
     */
    'import/first': 'error',

    /**
     * Require a newline after the last import/require.
     *
     * 🔧 Fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
     */
    'import/newline-after-import': 'error',

    /**
     * Disallow import of modules using absolute paths.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-absolute-path.md
     */
    'import/no-absolute-path': 'error',

    /**
     * Disallow cyclical dependencies between modules.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
     */
    'import/no-cycle': 'error',

    /**
     * Disallow the use of extraneous packages.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
     */
    'import/no-extraneous-dependencies': ['error', { includeTypes: true }],

    /**
     * Disallow mutable exports.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md
     */
    'import/no-mutable-exports': 'error',

    /**
     * Disallow importing packages through relative paths.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md
     */
    'import/no-relative-packages': 'error',

    /**
     * Disallow a module from importing itself.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-self-import.md
     */
    'import/no-self-import': 'error',

    /**
     * Ensures that there are no useless path segments.
     *
     * 🚫 Not fixable - https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
     */
    'import/no-useless-path-segments': ['error'],
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
  },
})
