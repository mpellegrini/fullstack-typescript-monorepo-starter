import type { Construct } from 'constructs'

import * as sns from 'aws-cdk-lib/aws-sns'
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import { type StackProps, Duration, Stack } from 'aws-cdk-lib/core'

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const queue = new sqs.Queue(this, 'DelmeQueue', {
      visibilityTimeout: Duration.seconds(300),
    })

    const topic = new sns.Topic(this, 'DelmeTopic')

    topic.addSubscription(new subs.SqsSubscription(queue))
  }
}
