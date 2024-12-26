import { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('new-package', {
    description: 'Creates a new @packages workspace',
    prompts: [
      {
        type: 'input',
        name: 'package-name',
        message: 'What is the package name?',
        validate: (input: string) => {
          if (!input) {
            return 'package name is required'
          }
          return true
        },
      },
      {
        type: 'input',
        name: 'package-description',
        message: 'Provide a description for this package?',
      },
    ],
    actions: (data) => {
      data['package-type'] = 'packages'
      let workspacePath = '{{package-type}}/{{kebabCase package-name}}'
      return [
        {
          type: 'add',
          path: `${workspacePath}/src/index.ts`,
          templateFile: 'templates/create-package/package-index.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${workspacePath}/package.json`,
          templateFile: 'templates/create-package/package.json.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${workspacePath}/tsconfig.json`,
          templateFile: 'templates/create-package/tsconfig.json.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${workspacePath}/eslint.config.js`,
          templateFile: 'templates/create-package/eslint.config.js.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: `${workspacePath}/vitest.config.js`,
          templateFile: 'templates/create-package/vitest.config.js.hbs',
          skipIfExists: true,
        },
      ]
    },
  })
}
