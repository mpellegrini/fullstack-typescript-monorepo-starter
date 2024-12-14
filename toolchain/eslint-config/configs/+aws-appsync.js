import plugin from '@aws-appsync/eslint-plugin'
import { defineFlatConfig } from 'eslint-define-config'

/**
 * @aws-appsync/eslint-plugin
 *
 * ESLint plugin that lints and produces errors for AWS AppSync resolvers written in JavaScript.
 * https://www.npmjs.com/package/@aws-appsync/eslint-plugin
 */
export default defineFlatConfig({
  files: ['**/*.resolver.ts'],
  plugins: {
    '@aws-appsync': plugin,
  },
  rules: {
    /**
     * Async processes and promises are not supported.
     */
    '@aws-appsync/no-async': 'error',

    /**
     * Async processes and promises are not supported.
     */
    '@aws-appsync/no-await': 'error',
    '@aws-appsync/no-promise': 'error',

    /**
     * Classes are not supported.
     */
    '@aws-appsync/no-classes': 'error',

    /**
     * for is not supported(except for for-in and for-of, which are supported)
     */
    '@aws-appsync/no-for': 'error',

    /**
     * continue is not supported.
     */
    '@aws-appsync/no-continue': 'error',

    /**
     * generators are not supported.
     */
    '@aws-appsync/no-generators': 'error',

    /**
     * yield is not supported.
     */
    '@aws-appsync/no-yield': 'error',

    /**
     * labels are not supported.
     */
    '@aws-appsync/no-labels': 'error',

    /**
     * this keyword is not supported.
     */
    '@aws-appsync/no-this': 'error',

    /**
     * try/catch structure is not supported.
     */
    '@aws-appsync/no-try': 'error',

    /**
     * while loops are not supported.
     */
    '@aws-appsync/no-while': 'error',

    /**
     * ++, --, and ~ unary operators are not allowed.
     */
    '@aws-appsync/no-disallowed-unary-operators': 'error',

    /**
     * instanceof operator is not allowed.
     */
    '@aws-appsync/no-disallowed-binary-operators': 'error',

    /**
     * regex literals are not supported
     */
    '@aws-appsync/no-regex': 'error',

    /**
     * re-assigning context and base properties of context are not allowed.
     */
    '@aws-appsync/no-disallowed-re-assignment': 'error',

    /**
     * recursive function calls re ot allowed.
     */
    '@aws-appsync/no-recursion': 'error',

    /**
     * Some methods are not allowed.
     * See the reference for a full set of supported built-in functions
     */
    '@aws-appsync/no-disallowed-methods': 'error',

    /**
     *  Passing functions as function arguments to functions is not allowed.
     */
    '@aws-appsync/no-function-passing': 'error',

    /**
     * Functions cannot be reassigned.
     */
    '@aws-appsync/no-function-reassign': 'error',

    /**
     * Functions cannot be the return value of functions
     */
    '@aws-appsync/no-function-return': 'error',

    /**
     * in operator is not supported.
     */
    '@aws-appsync/no-in-operator': 'error',

    // TODO: Currently no rule to enforce no throw statements.
  },
})
