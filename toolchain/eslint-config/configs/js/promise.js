import plugin from 'eslint-plugin-promise'
import { config } from 'typescript-eslint'

/**
 * eslint-plugin-promise configuration
 *
 * Enforce best practices for JavaScript promises.
 * https://github.com/eslint-community/eslint-plugin-promise
 */
export default config(plugin.configs['flat/recommended'])
