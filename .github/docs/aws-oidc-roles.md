# AWS OIDC roles for GitHub Actions

CI authenticates to AWS exclusively via GitHub's OIDC provider — no long-lived
keys. Two IAM roles exist, and the split is a security boundary, not an
organizational nicety.

## Why two roles

`pull_request` workflows execute the **PR branch's copy** of the workflow
files. Any YAML-side guard (the scan gate, the digest-only push discipline, the
`latest` head-of-main check) can be edited away by the PR itself. The only
control the PR cannot forge is the **OIDC token's `sub` claim**, which GitHub
sets from the trigger:

| Trigger | `sub` claim |
| --- | --- |
| `pull_request` | `repo:<owner>/<repo>:pull_request` |
| `push` to main, `workflow_dispatch` on main, `pull_request_target` | `repo:<owner>/<repo>:ref:refs/heads/main` |

So the IAM **trust policies** are the real enforcement point: a PR-modified
workflow physically cannot assume the trusted role, no matter what its YAML
says.

## Role: `gha-ci-pr` → repo variable `AWS_GHA_PR_ROLE_ARN`

Assumed by `_docker-build-stage.yml`, `_docker-security-scan.yml`, and
`_ecr-publish.yml` on `pull_request` events. Push/pull only — **no delete**.

Trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:<OWNER>/<REPO>:pull_request"
        }
      }
    }
  ]
}
```

Permission policy (resource-scoped to the app image repos — the `imageName`
values in `apps/*/deploy.json`, all under the `monorepo/` prefix):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EcrAuth",
      "Effect": "Allow",
      "Action": "ecr:GetAuthorizationToken",
      "Resource": "*"
    },
    {
      "Sid": "EcrPushPull",
      "Effect": "Allow",
      "Action": [
        "ecr:DescribeRepositories",
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "arn:aws:ecr:<REGION>:<ACCOUNT_ID>:repository/monorepo/*"
    }
  ]
}
```

## Role: `gha-ci-main` → repo variable `AWS_GHA_ROLE_ARN`

Assumed on `push` to main (build/scan/publish), `workflow_dispatch` from main
(`release-create.yml`), and `pull_request_target` (`ecr-cleanup.yml` — which
runs the base branch's reviewed workflow code, never the PR's).

Trust policy: identical to the PR role except

```json
"token.actions.githubusercontent.com:sub": "repo:<OWNER>/<REPO>:ref:refs/heads/main"
```

Permission policy: the PR role's policy **plus** `ecr:BatchDeleteImage` in the
`EcrPushPull` statement (needed by `ecr-cleanup.yml` to prune a closed PR's
tags).

> If the existing role's trust policy is broader than `ref:refs/heads/main`
> (e.g. `repo:<OWNER>/<REPO>:*`), tightening it is the load-bearing part of
> this whole setup — do not skip it.

## Rollout order

The workflows select the role by event
(`github.event_name == 'pull_request' && vars.AWS_GHA_PR_ROLE_ARN || vars.AWS_GHA_ROLE_ARN`),
so the PR role must exist before the workflow change merges:

1. Provision `gha-ci-pr` (trust + permission policies above) via IaC.
2. Set the repo variable `AWS_GHA_PR_ROLE_ARN` to its ARN.
3. Tighten `gha-ci-main`'s trust policy to `ref:refs/heads/main` only.
4. Merge the workflow change. (Its own PR run already uses the new YAML, so
   docker jobs on that PR fail until steps 1–2 are done — expected.)

If `AWS_GHA_PR_ROLE_ARN` is ever unset, the expression falls back to the
trusted role ARN — and the assume-role call then **fails** on the PR run,
because the trusted trust policy rejects the `pull_request` sub. Misconfig
fails closed; it does not silently re-open the hole.

## Residual risk (known, accepted for now)

IAM has no condition key for ECR image tag names, so the PR role's
`ecr:PutImage` can still create or repoint any tag in the shared repos —
including `latest` — if a PR deliberately rewrites the workflow. The split
removes the destructive and deploy-adjacent capabilities and shrinks the blast
radius; closing the tag-repointing gap needs one of:

- **ECR tag immutability with exclusion filters** on the app repos (exclude
  `cache-*` and `latest`, which must stay mutable), making `sha-*`/`pr-*` tags
  write-once; or
- publishing PR images to a **separate PR-only repo/namespace** the PR role is
  scoped to, keeping the production repos out of reach of PR runs entirely.

`release-deploy.yml` independently refuses anything not released by the release
bot from a main-ancestor commit, so a repointed tag alone does not reach
deployment.