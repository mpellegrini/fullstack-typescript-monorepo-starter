import { fixupPluginRules } from '@eslint/compat'
import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-deprecation'

export default defineFlatConfig({
  plugins: {
    deprecation: fixupPluginRules(plugin),
  },
  rules: {
    'deprecation/deprecation': 'error',
  },
})
