import turbo from 'eslint-plugin-turbo'

export default [
  {
    plugins: {
      turbo,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
]
