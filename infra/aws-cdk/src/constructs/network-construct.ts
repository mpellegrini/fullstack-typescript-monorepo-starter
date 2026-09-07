import {
  type IVpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  IpAddresses,
  NatProvider,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

export interface VpcProps {
  cidr: string
  isolatedSubnetCidrMask?: number
  maxAZs?: number
  privateSubnetCidrMask?: number
  publicSubnetCidrMask?: number
}

export class NetworkConstruct extends Construct {
  public readonly vpc: IVpc
  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id)

    this.vpc = new Vpc(this, 'Vpc', {
      // vpcName: `${id}-vpc`,
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: props.maxAZs ?? 0,
      natGatewayProvider: NatProvider.instanceV2({
        instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
      }),
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: props.publicSubnetCidrMask,
          name: 'public-subnet-1',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: props.privateSubnetCidrMask,
          name: 'private-subnet-1',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: props.isolatedSubnetCidrMask,
          name: 'isolated-subnet-1',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })
  }
}
