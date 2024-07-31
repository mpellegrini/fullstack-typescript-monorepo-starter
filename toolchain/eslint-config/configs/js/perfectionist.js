import { defineFlatConfig } from 'eslint-define-config'
import plugin from 'eslint-plugin-perfectionist'

const sortingMethodType = 'natural'

/*
  TODO: Need to implement the following additional rules
  * sort-svelte-attributes
  * sort-named-imports
  * sort-imports
 */

/**
 * eslint-plugin-perfectionist configuration
 *
 * ESLint plugin with rules that take your code to a beauty salon.
 * https://github.com/azat-io/eslint-plugin-perfectionist
 */
export default defineFlatConfig({
  plugins: {
    perfectionist: plugin,
  },
  rules: {
    'perfectionist/sort-classes': [
      'error',
      {
        customGroups: {},
        groups: [
          'index-signature',
          'static-property',
          'protected-property',
          'private-property',
          'property',
          'constructor',
          'static-method',
          'protected-method',
          'private-method',
          'method',
          ['get-method', 'set-method'],
          'unknown',
        ],
        ignoreCase: true,
        order: 'asc',
        partitionByComment: true,
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-enums': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        partitionByComment: true,
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-exports': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-interfaces': [
      'error',
      {
        customGroups: {},
        groupKind: 'mixed',
        groups: [],
        ignoreCase: true,
        ignorePattern: [],
        order: 'asc',
        partitionByNewLine: true,
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-intersection-types': [
      'error',
      {
        groups: ['named'],
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-maps': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-named-exports': [
      'error',
      {
        groupKind: 'types-first',
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-object-types': [
      'error',
      {
        customGroups: {},
        groupKind: 'mixed',
        groups: [],
        ignoreCase: true,
        order: 'asc',
        partitionByNewLine: true,
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-objects': [
      'error',
      {
        customGroups: { top: ['id'] },
        customIgnore: [],
        groups: ['top'],
        ignoreCase: true,
        ignorePattern: [],
        order: 'asc',
        partitionByComment: true,
        partitionByNewLine: true,
        styledComponents: true,
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-switch-case': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-union-types': [
      'error',
      {
        groups: ['named', 'keyword', 'nullish'],
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-variable-declarations': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
  },
})
