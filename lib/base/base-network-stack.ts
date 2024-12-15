import env from './env';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';

// VPC, Route53 구성
export class BaseNetworkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'Vpc', {
      ipAddresses: ec2.IpAddresses.cidr(env.VPC_CIDR),
      maxAzs: env.VPC_MAX_AZS,
      subnetConfiguration: [{
        name: 'Public',
        subnetType: ec2.SubnetType.PUBLIC,
        cidrMask: env.VPC_SUBNET_CIDR_MASK,
      // }, {
      //   // NAT gateway 필요 (과금)
      //   name: 'PivateEgress',
      //   subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      //   cidrMask: env.VPC_SUBNET_CIDR_MASK,
      }, {
        name: 'PrivateIsolated',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        cidrMask: env.VPC_SUBNET_CIDR_MASK,
      }],
    });

    // VPC Outputs
    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId }); 

    // Route53
    const hostedZone = new route53.PublicHostedZone(this, 'DefaultHostedZone', {
      zoneName: env.DEFAULT_HOSTED_ZONE_NAME,
    });

    // Route53 Outputs
    new cdk.CfnOutput(this, 'DefaultHostedZoneId', { value: hostedZone.hostedZoneId }); 
    new cdk.CfnOutput(this, 'DefaultHostedZoneName', { value: hostedZone.zoneName }); 
  }
}
