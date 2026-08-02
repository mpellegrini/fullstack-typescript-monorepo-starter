import { BaseApp } from '@packages/aws-cdk-lib'

import { NetworkStack } from './stacks/network-stack.ts'

const app = new BaseApp()

new NetworkStack(app, 'hg-dev-nw', {})

app.synth()
