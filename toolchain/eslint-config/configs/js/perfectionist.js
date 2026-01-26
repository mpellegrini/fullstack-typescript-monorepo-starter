import plugin from 'eslint-plugin-perfectionist'
import { config } from 'typescript-eslint'

const sortingMethodType = 'natural'

/**
 * eslint-plugin-perfectionist configuration
 *
 * ESLint plugin with rules that take your code to a beauty salon.
 * https://github.com/azat-io/eslint-plugin-perfectionist
 */
export default config({
  name: 'eslint-config:config:js:perfectionist',

  plugins: {
    perfectionist: plugin,
  },
  rules: {
    'perfectionist/sort-classes': [
      'error',
      {
        customGroups: [],
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
    'perfectionist/sort-imports': [
      'error',
      {
        customGroups: [
          {
            elementNamePattern: [String.raw`^\$lib/.*`],
            groupName: 'ts-paths',
          },
        ],
        environment: 'node',
        groups: [
          'type-import',
          ['value-builtin', 'value-external'],
          'type-internal',
          'value-internal',
          'ts-paths',
          'type-parent',
          'type-sibling',
          'type-index',
          'value-parent',
          'value-sibling',
          'value-index',
          'ts-equals-import',
          'unknown',
        ],
        ignoreCase: true,
        internalPattern: ['^@(apps|packages|infrastructure|toolchain)/.*'],
        maxLineLength: undefined,
        newlinesBetween: 1,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-interfaces': [
      'error',
      {
        ignoreCase: true,
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
        groups: ['type-export', 'value-export'],
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-named-imports': [
      'error',
      {
        groups: ['type-import', 'value-import'],
        ignoreAlias: false,
        ignoreCase: true,
        order: 'asc',
        type: sortingMethodType,
      },
    ],
    'perfectionist/sort-object-types': [
      'error',
      {
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
        customGroups: [
          {
            elementNamePattern: ['^id$'],
            groupName: 'top',
          },
        ],
        groups: ['top', 'unknown'],
        ignoreCase: true,
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
