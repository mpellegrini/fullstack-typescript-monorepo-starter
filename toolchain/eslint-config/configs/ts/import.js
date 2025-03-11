import plugin from 'eslint-plugin-import'
import { config } from 'typescript-eslint'

export default config(
  //
  plugin.flatConfigs.typescript,
  {
    name: 'eslint-config:config:ts:import',

    rules: {
      // TypeScript already provides the same checks as part of standard type checking
      // see https://typescript-eslint.io/troubleshooting/typed-linting/performance#eslint-plugin-import
      'import/default': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',

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
      'import/resolver': {
        typescript: true,
      },
    },
  },
)
