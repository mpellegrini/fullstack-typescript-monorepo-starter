import type { Construct } from 'constructs'

import * as iam from 'aws-cdk-lib/aws-iam'
import * as cdk from 'aws-cdk-lib/core'

export interface GitHubOidcStackProps extends cdk.StackProps {
  /**
   * A list of GitHub repositories you want to be able to access the IAM role.
   * Each entry should be your GitHub username and repository passed in as a
   * single string.
   *
   * For example, `['owner/repo1', 'owner/repo2'].
   */
  readonly repos: string[]

  /**
   * The name of the Oidc role.
   *
   * @default 'GitHubActionsDeploymentRole'
   */
  readonly roleName?: string

  /**
   * The GitHub OpenId Connect Provider. Must have provider url
   * `https://token.actions.githubusercontent.com`. The audience must be
   * `sts:amazonaws.com`.
   *
   * Only one such provider can be defined per account, so if you already
   * have a provider with the same url, a new provider cannot be created for you.
   *
   * @default - a provider is created for you.
   */
  readonly oidcConnectProvider?: iam.IOpenIdConnectProvider
}

export class GitHubOidcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GitHubOidcStackProps) {
    super(scope, id, props)

    const rawEndpoint = 'token.actions.githubusercontent.com'
    const clientId = 'sts.amazonaws.com'

    // Create the GitHub OIDC provider
    const githubOidcProvider = new iam.OpenIdConnectProvider(this, `GitHubOidcProvider`, {
      clientIds: [clientId],
      url: `https://${rawEndpoint}`,
    })

    const oidcPrincipal = new iam.OpenIdConnectPrincipal(githubOidcProvider).withConditions({
      StringEquals: {
        [`${rawEndpoint}:aud`]: clientId,
      },
      StringLike: {
        [`${rawEndpoint}:sub`]: props.repos.map((repo) => `repo:${repo}`),
      },
    })

    // Allow assuming all of the CDK bootstrap roles, tagged by CDK
    const oidcPolicyStatement = new iam.PolicyStatement({
      actions: ['sts:AssumeRole'],
      conditions: {
        'ForAnyValue:StringEquals': {
          'iam:ResourceTag/aws-cdk:bootstrap-role': [
            'deploy',
            'lookup',
            'file-publishing',
            'image-publishing',
          ],
        },
      },
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    })

    // Allow authenticating to ECR to pull/push Docker images
    const ecrPolicyStatement = new iam.PolicyStatement({
      actions: ['ecr:GetAuthorizationToken'],
      effect: iam.Effect.ALLOW,
      resources: ['*'],
    })

    const role = new iam.Role(this, 'GitHubActionsRole', {
      assumedBy: oidcPrincipal,
      description: 'IAM role for GitHub Actions to assume for AWS deployment',
      inlinePolicies: {
        AssumeBootstrapRoles: new iam.PolicyDocument({
          statements: [oidcPolicyStatement, ecrPolicyStatement],
        }),
      },
      maxSessionDuration: cdk.Duration.hours(1),
      roleName: props.roleName ?? 'GitHubActionsDeploymentRole',
    })

    // show the role arn in the stack output
    new cdk.CfnOutput(this, 'roleArn', {
      value: role.roleArn,
    })
  }
}
