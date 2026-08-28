# Dependencies

**Every dependency add / remove / upgrade requires Tyler's explicit approval, before it
happens.** This includes transitive-only bumps done to clear an advisory.

## Package manager

**bun** (`bun@1.3.14`), pinned via `packageManager` in `package.json`. Node 24 (Active
LTS) via `.nvmrc`; `engines.node` is a `>=20.9.0` floor, not a hard pin.

Use `bun run <script>` / `bun install` — never `yarn` or `npm`. `yarn.lock` was removed in
Step 0 (#14).

## Do not reintroduce dropped deps

Removed in PR1 (#19) as unused or superseded — do not add them back:

`@chakra-ui/next-js` · `@emotion/styled` · `framer-motion` · the v2 `@chakra-ui/cli`

Use `next/image` directly (Next 13.4 has it) instead of `@chakra-ui/next-js`.

## Pre-cleared adds (approved for PR2)

- `@fontsource/jetbrains-mono` — the redesign's mono face
- `@crowdin/cli` — devDep, makes `crowdin status` a runnable dry-run

## Approved adds — Oversight (2026-08-28)

Both devDeps, both approved by Tyler before the add, recorded here so the approval is not
only in a PR body.

- `storybook-addon-oversight` (#33) — lints the MCP components manifest in the Storybook
  panel. Zero transitive deps.
- `oversight-lint` (#37) — the headless half of the same rules, run by `bun run oversight`
  and by `ci.yml`. Zero transitive deps.

**Why the CLI is a real dependency rather than a `bunx` call.** It started as
`bunx --bun oversight-lint@0.7.1`, which needs no dependency (the `wait-on` precedent in
dev-server.md). That was fine while it was a convenience someone ran by hand. Once #36 made
it a **required CI gate**, a live registry fetch sat in the path of every run — an outage or
an unpublished version turns a gate into a build failure with nothing to do with this repo.
A devDependency resolves it from the frozen lockfile instead.

The rule that generalises: **`bunx` is fine for something optional, not for something CI
depends on.** Weigh it again if another `bunx` call is ever promoted into a gate.

## Vulnerability gate: `bun audit`, NOT Dependabot

**Dependabot is structurally blind to this repo.** It has no bun-lockfile support, so it
sees **38 packages of ~937**. Every alert it raises is attributed to `package.json` and
all of them name a single package (`next`). The apparent 65 → 26 "improvement" after Step 0
was **measurement loss, not remediation** — nothing was fixed. `.github/dependabot.yml` is
deliberately scoped to `github-actions` only.

**Use `bun audit`.** Baseline (2026-07-15): **53 rows — 2 critical, 21 high, 24 moderate,
6 low.**

- **26 rows are `next`** → clear with PR3's Next 13→16 bump. That is the Next bump's
  *entire* vuln contribution.
- **27 rows are transitive and invisible to Dependabot**, incl. a **CRITICAL in
  `i18next-fs-backend`** (reached via `next-i18next`) — a genuine production runtime vuln
  that Next 16 does **not** touch. Needs its own bump; highest-priority dep item in PR3.

Never cite Dependabot's count as evidence. A metric that improved because measurement
broke is the same failure class as "typecheck passes" on a dead token.

## `dependencies` / `devDependencies` are misclassified

`eslint`, `typescript`, `eslint-config-next`, and the `@types/*` sit in `dependencies`, so
`bun audit --prod` reports 52 of 53 — which is *not* what ships. Fix the classification in
PR3's dep pass so `--prod` means something.
