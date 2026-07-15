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
