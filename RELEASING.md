<!--
SPDX-FileCopyrightText: 2026 LiveKit, Inc.

SPDX-License-Identifier: Apache-2.0
-->

# Releasing node-sdks

This repository releases with [verwalter](https://github.com/livekit/verwalter).
The commands that are the same in every repository are in the
[verwalter cheat sheet](https://github.com/livekit/verwalter/blob/main/docs/cheat-sheet.md).
This file holds what is specific to this repository.

Change this file in the same pull request as the workflow it describes.

## Packages

| Package | Tag | Goes to |
|---|---|---|
| `livekit-server-sdk` | `livekit-server-sdk@<version>` | npm, and the docs site for a final release |
| `@livekit/rtc-node` | `@livekit/rtc-node@<version>` | npm |

`@livekit/rtc-node` uses the native bindings `@livekit/rtc-ffi-bindings`.
That package is not released from this repository.

## Workflows

| File | Starts when | Does |
|---|---|---|
| `changeset-check.yml` | A PR into `main` is opened or updated | Fails a PR that changes a package without a changeset. The `internal` label skips the check. |
| `release-pr.yml` | A push to `main` | Keeps the release PR current. |
| `release.yml` | The release PR merges, or a run by hand | Builds, tags, creates the GitHub releases, publishes to npm, checks the end state, deploys the docs. |
| `pre-release.yml` | A run by hand | Opens an rc PR for the branch it runs on. |

`release.yml` has five jobs, in this order:

1. `build` builds both packages. The later jobs use this build.
2. `release` tags and creates the GitHub releases.
3. `publish` runs `pnpm publish` per package with npm trusted
   publishing. One publish runs at a time.
4. `verify` runs `verwalter status --check`.
5. `docs` builds the server SDK docs and uploads them to S3. It runs
   only for a final `livekit-server-sdk` release from `main`.

## Release

1. Merge the release PR.
2. Watch the run of `release.yml`: `gh run list --workflow release.yml --limit 1`.

A release is complete when:

- Each tag of the release PR has a public GitHub release.
- npm has each version.
- For a final `livekit-server-sdk` release, the `docs` job is green.

The `verify` job checks the first two. When the `verify` job is red,
the release is incomplete. The other jobs can be green at the same time.

## Pre-release

```sh
gh workflow run pre-release.yml --ref <branch>
```

This opens an rc PR into `<branch>`. Merge it to release the rc. An rc
does not replace the docs.

## A release failed

Find the cause first. The paths by cause are in the
[recovery section](https://github.com/livekit/verwalter/blob/main/docs/release-workflows.md#recovery).

| Situation | Command |
|---|---|
| A job failed for a transient reason | `gh run rerun <run-id> --failed` |
| The workflow file needed a fix, and the fix is on `main` | `gh workflow run release.yml -f ref=<tag>` |
| The docs upload failed | `gh workflow run release.yml -f package=livekit-server-sdk -f ref=livekit-server-sdk@<version>` |
| The released commit is wrong | `verwalter release --abandon <tag>`, then a changeset and the next version |

A re-run of failed jobs keeps the merge commit. Prefer it to a run by
hand. Set `ref` on a run by hand: an empty `ref` releases the head of
the branch. If no tag exists yet, set `ref` to the merge commit of the
release PR.

`publish` skips a version that npm has. It fails a package whose files
changed since its tag. npm does not allow a version to be published
twice, so a wrong version on npm needs a new version.
