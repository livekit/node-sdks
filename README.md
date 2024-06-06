<!--
SPDX-FileCopyrightText: 2024 LiveKit, Inc.

SPDX-License-Identifier: Apache-2.0
-->

<!--BEGIN_BANNER_IMAGE-->

<!--END_BANNER_IMAGE-->

<h1>
  LiveKit Node SDKs
</h1>

<!--BEGIN_DESCRIPTION-->

<!--END_DESCRIPTION-->

## Monorepo Navigation

- **Packages**:
  - [Server SDK](/packages/livekit-server-sdk/README.md)
  - [Node real-time SDK](/packages/livekit-rtc/README.md)
- **Examples**
  - [Webhooks HTTP (server SDK)](/examples/webhooks-http/README.md)
  - [Webhooks NextJS (server SDK)](/examples/webhooks-nextjs/README.md)
  - [Basic Room (real-time SDK)](/examples/basic_room/)

<br/>
<br/>

## Development Setup

If you are interested in contributing to the project or running the examples that are part of this mono-repository, then you must first set up your development environment.

### Setup Monorepo

This repo consists of multiple packages that partly build on top of each other.
It relies on pnpm workspaces and [Turborepo](https://turbo.build/repo/docs) (which gets installed automatically).

Clone the repo and run `pnpm install` the root level:

```shell
pnpm install
```

In order to link up initial dependencies and check whether everything has installed correctly run

```shell
pnpm build
```

This will build all the packages in `/packages` and the examples in `/examples` once.

After that you can use a more granular command to only rebuild the packages you are working on.

<!--BEGIN_REPO_NAV-->

<!--END_REPO_NAV-->
