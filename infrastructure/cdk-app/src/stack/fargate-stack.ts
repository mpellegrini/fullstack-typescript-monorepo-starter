import type { Construct } from 'constructs'

import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns'
import { type StackProps, Stack } from 'aws-cdk-lib/core'

export class FargateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const repo = ecr.Repository.fromRepositoryName(this, 'SomeRepository', 'reponame')

    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', { isDefault: true })

    const cluster = new ecs.Cluster(this, `Cluster`, {
      vpc,
    }) as unknown as ecs.ICluster

    new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      serviceName: 'MyService',
      taskImageOptions: {
        containerName: repo.repositoryName,
        containerPort: 3000,
        image: ecs.ContainerImage.fromEcrRepository(repo, 'latest'),
      },
    })
  }
}
