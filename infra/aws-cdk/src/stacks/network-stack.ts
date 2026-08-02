import type { Construct } from 'constructs'

import { type StackProps, Aspects, Stack, Tag } from 'aws-cdk-lib'
import {
  type ISubnet,
  type IVpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  IpAddresses,
  NatProvider,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2'

export class NetworkStack extends Stack {
  public readonly vpc: IVpc

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const stackName = Stack.of(this).stackName

    this.vpc = new Vpc(this, `${stackName}-vpc`, {
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 2,
      natGatewayProvider: NatProvider.instanceV2({
        instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
      }),
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet-1',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-subnet-1',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'isolated-subnet-1',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })

    Aspects.of(this.vpc).add(new Tag('Name', `${stackName}-vpc`))
    this.nameSubnets(this.vpc.publicSubnets)
    this.nameSubnets(this.vpc.privateSubnets)
    this.nameSubnets(this.vpc.isolatedSubnets)

    this.vpc.addFlowLog('FlowLog')
  }

  private nameSubnets(subnets: ISubnet[]): void {
    for (const subnet of subnets) {
      Aspects.of(subnet).add(
        new Tag(
          'Name',
          `${this.vpc.node.id}/${subnet.node.id.replace(/Subnet[0-9]$/, '')}/${
            subnet.availabilityZone
          }`,
        ),
      )
    }
  }
}
