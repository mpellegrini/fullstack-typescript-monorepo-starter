import { defineFlatConfig } from 'eslint-define-config'

export default defineFlatConfig({
  rules: {
    // TypeScript already provides the same checks as part of standard type checking
    // see https://typescript-eslint.io/linting/troubleshooting/performance-troubleshooting/#eslint-plugin-import
    'import/default': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default-member': 'off',

    // TODO: Might want to consider turning these on at least during CI
    'import/no-cycle': 'off',
    'import/no-deprecated': 'off',
    'import/no-named-as-default': 'off',
    'import/no-unused-modules': 'off',

    // TypeScript will automatically enforce that you include extensions
    // when moduleResolution is set to Node16 or NodeNext.
    'import/extensions': 'off',
  },
  settings: {
    'import/extensions': ['.ts', '.cts', '.mts', '.tsx', '.js', '.cjs', '.mjs', '.jsx'],
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.ts', '.cts', '.mts', '.tsx', '.js', '.cjs', '.mjs', '.jsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
})
