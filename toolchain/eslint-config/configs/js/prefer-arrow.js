import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-prefer-arrow'

/**
 * eslint-plugin-promise configuration
 *
 * Enforce best practices for JavaScript promises.
 * https://github.com/eslint-community/eslint-plugin-promise
 */
export default defineFlatConfig({
  plugins: {
    'prefer-arrow': plugin,
  },
  rules: {
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        allowStandaloneDeclarations: false,
        classPropertiesAllowed: false,
        disallowPrototype: true,
        singleReturnOnly: false,
      },
    ],
  },
})
