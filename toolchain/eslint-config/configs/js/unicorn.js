import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-unicorn'

export default defineFlatConfig({
  plugins: {
    unicorn: plugin,
  },
  rules: {
    /**
     * Require consistent filename case for all linted files.
     *
     * 🚫 Not fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/filename-case.md
     */
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],

    /**
     * Require using the node: protocol when importing Node.js built-in modules.
     *
     * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md
     */
    'unicorn/prefer-node-protocol': 'error',

    /**
     * Enforce passing a message value when creating a built-in error
     *
     * 🚫 Not fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/error-message.md
     */
    'unicorn/error-message': 'error',

    /**
     * Enforce the use of new for all builtins, except String, Number, Boolean, Symbol and BigInt
     *
     * 🔧 Fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/new-for-builtins.md
     */
    'unicorn/new-for-builtins': 'error',

    /**
     * Disallow empty files
     *
     * 🚫 Not fixable - https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-empty-file.md
     *
     */
    'unicorn/no-empty-file': 'error',
  },
})
