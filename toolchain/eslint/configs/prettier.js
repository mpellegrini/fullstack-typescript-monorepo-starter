import prettierPlugin from 'eslint-config-prettier'
import { config } from 'typescript-eslint'

/**
 * eslint-config-prettier configuration
 *
 * Turns off all rules that are unnecessary or might conflict with Prettier.
 * https://github.com/prettier/eslint-config-prettier
 *
 * !IMPORTANT!: This configuration MUST always appear last in any ESLint profile definition.
 */
export default config(prettierPlugin)
