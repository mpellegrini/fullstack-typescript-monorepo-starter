import { Template } from 'aws-cdk-lib/assertions'
import * as cdk from 'aws-cdk-lib/core'

import { MyStack } from './my-stack.js'

describe('my-stack', () => {
  it('sqs queue and sns topic created', () => {
    expect.hasAssertions()
    const app = new cdk.App()
    // WHEN
    const stack = new MyStack(app, 'MyTestStack')
    // THEN

    const template = Template.fromStack(stack)

    template.hasResourceProperties('AWS::SQS::Queue', {
      VisibilityTimeout: 300,
    })
    template.resourceCountIs('AWS::SNS::Topic', 1)
  })
})
