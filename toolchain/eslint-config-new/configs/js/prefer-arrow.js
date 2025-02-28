import plugin from 'eslint-plugin-prefer-arrow'
import { config } from 'typescript-eslint'

/**
 * eslint-plugin-prefer-arrow configuration
 *
 * ESLint plugin to prefer arrow functions.
 * https://github.com/TristonJ/eslint-plugin-prefer-arrow
 */
export default config({
  name: 'eslint-config:config:js:prefer-arrow',

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
