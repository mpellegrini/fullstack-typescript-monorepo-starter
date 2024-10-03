# Fullstack Typescript Monorepo Starter

## Overview

| Folder    | Description                                                           |
|-----------|-----------------------------------------------------------------------|
| packages  | packages for shared code libraries                                    |
| apps      | packages for web applications                                         |
| toolchain | packages supporting the shared toolchain (eslint, vitest, typescript) |

## Prerequisites

| Folder  | Description                                                                                                                                                  |
|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Node.js | check node version in engines section of package.json for latest minimum version                                                                             |
| PNPM    | Fast, disk space efficient package manager ([PNpm](https://pnpm.io)) <br>(best to install via corepack) <pre lang="shell"><code># corepack enable pnpm</pre> |

## Useful Monorepo Operations

### Setup

Install the dependencies for all workspaces in the monorepo

```shell
pnpm install
```

### Clean

Remove all generated `build` artifacts for all workspaces in the monorepo

```shell
pnpm run -w clean
```

### Build

Produce final generated artifacts for deployment for all relevant workspaces in the monorepo
> [!NOTE]
> Not all workspaces in the monorepo have or need `build`tasks

```shell
pnpm run -w build
```

### Test

Run unit tests for all workspaces in the monorepo

```shell
pnpm run -w test
```

### Lint

Run unit tests for all workspaces in the monorepo

```shell
pnpm run -w lint
```

### Type Check

Run TypeScript type checks for all workspaces in the monorepo

```shell
pnpm run -w typecheck
```

## Building Docker Image

```shell
docker build . -t sveltekit-example-app --build-arg="APP_NAME=sveltekit-example-app"
```

```shell
docker run --rm --name=sveltekit-example-app -p 8080:3000 sveltekit-example-app
```

## Conventional Commits Best Practices

Commit messages must adhere to [Conventional Commits](https://www.conventionalcommits.org/) best practices. The format
proposed by this convention leads to easier to read
commit history.

Each commit message consists of a header, a body, and a footer.

### Default

<pre>
<b><a href="#types">&lt;type&gt;</a></b>(<b><a href="#scopes">&lt;optional scope&gt;</a></b>): <b><a href="#subject">&lt;subject&gt;</a></b>
<sub>empty separator line</sub>
<b><a href="#body">&lt;optional body&gt;</a></b>
<sub>empty separator line</sub>
<b><a href="#footer">&lt;optional footer&gt;</a></b>
</pre>

### Types

|          |                          |                                                                                                        |
|----------|--------------------------|--------------------------------------------------------------------------------------------------------|
| feat     | Features                 | A new feature                                                                                          |
| fix      | Bug Fixes                | A bug fix                                                                                              |
| docs     | Documentation            | Documentation only changes                                                                             |
| style    | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| refactor | Code refactoring         | A code change that neither fixes a bug nor adds a feature                                              |
| perf     | Performance Improvements | A code change that improves performance                                                                |
| test     | Tests                    | Adding missing tests or correcting existing tests                                                      |
| build    | Builds                   | Changes that affect the build system or external dependencies (example scopes: turborepo, pnpm)        |
| ci       | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: gh-actions)                         |
| chore    | Chores                   | Other changes that don't modify source or test files                                                   |
| revert   | Reverts                  | Reverts a previous commit                                                                              |
|

### Scopes

The `scope` provides additional contextual information.

* Is an **optional** part of the format
* Allowed Scopes depends on the specific project
* Don't use issue identifiers as scopes

### Subject

The `subject` contains a succinct description of the change.

* Is a **mandatory** part of the format
* Use the imperative, present tense: "change" not "changed" nor "changes"
* Do not capitalize the first letter
* No dot (.) at the end

### Body

The `body` should include the motivation for the change and contrast this with previous behavior.

* Is an **optional** part of the format
* Use the imperative, present tense: "change" not "changed" nor "changes"
* This is the place to mention issue identifiers and their relations

### Footer

The `footer` should contain any information about **Breaking Changes** and is also the place to **reference Issues**
that this commit refers to.

* Is an **optional** part of the format
* **optionally** reference an issue by its id.
* **Breaking Changes** should start with the word `BREAKING CHANGES:` followed by space or two newlines. The rest of the
  commit message is then used for this.

### Examples

* ```
  feat(shopping cart): add the amazing button
  ```
* ```
  feat: remove ticket list endpoint
  
  refers to JIRA-1337
  BREAKING CHANGES: ticket endpoints no longer supports list all entities.
  ```
* ```
  fix: add missing parameter to service call
  
  The error occurred because of <reasons>.
  ```
* ```
  build(release): bump version to 1.0.0
  ```
* ```
  build: update dependencies
  ```
* ```
  refactor: implement calculation method as recursion
  ```
* ```
  style: remove empty line
  ```
