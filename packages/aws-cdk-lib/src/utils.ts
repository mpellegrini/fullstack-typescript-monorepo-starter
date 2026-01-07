import type { Construct } from 'constructs'

import { pascalCase } from 'change-case'

export const nameIt = (scope: Construct, id: string): string => {
  const stage = scope.node.tryGetContext('stage') as string
  const name = scope.node.tryGetContext('name') as string
  return `${pascalCase(stage.toLowerCase())}${pascalCase(name.toLowerCase())}${pascalCase(id)}`
}
