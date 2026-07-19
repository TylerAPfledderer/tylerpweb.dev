# Branch & git safety

**This site is in production.** `main` is protected and continuously deployable.
This file is the single source for branch model + git rules (git-safety.md was folded
in here).

## Branch model

```
main (production, protected — CI check required)
 └─ modernize-updates          ◄── long-lived INTEGRATION branch
       │  Step 0 CI (#14) · PR0 Storybook (#17) · self-host-fonts (#18) ·
       │  ci/chromatic (#20) · PR1 Chakra v3 (#19) — all ✅ merged
       │
       │  PR2 redesign lands as ONE PR PER SECTION (not a single PR):
       ├─ feat/redesign-work      ✅ #25/#26
       ├─ feat/redesign-about     ✅ #28
       ├─ feat/redesign-contact   ✅ #29
       ├─ feat/redesign-skills    ⬜ remaining
       ├─ feat/redesign-hero      ⬜ remaining
       ├─ feat/header             ⬜ remaining (new Header.tsx)
       │  then redesign sweep (retire MainSection, etc.)
       └─ chore/next16-upgrade    ⬜ PR3 (last)

       modernize-updates ─► main   single final PR, after all gates + Vercel preview
```

## Rules

- Feature branches target **`modernize-updates`**, never `main`.
- **Into `main`: always a PR + Tyler's approval. No exceptions.**
- **One risky change per PR**, so any regression is bisectable. A full-page redesign is
  many risky changes → per-section PRs, each with its own readable Chromatic diff.
- **Never** commit, push, or merge to `main` without Tyler's explicit approval.
- **Never** force-push or rewrite history without explicit approval. Prefer
  `--force-with-lease` when a rewrite is approved.
- **Commit or push only when asked.** If work starts on `main`, branch first.
- **Merge into `modernize-updates` requires, in order:** CI green → a `code-review` of the
  diff → Tyler's go.
- After any interrupted git op (e.g. a `pkill` returning a signal), verify
  `git rev-parse HEAD` + `git branch --show-current` before continuing — an interrupted
  `switch -c` can leave a 0-byte ref and an unborn HEAD.

## Direct-push vs. PR

| Push directly to integration/working branch | Requires a PR (CI-gated) |
|---|---|
| Docs/meta the built site can't consume: `PLAN.md` · `.claude/rules/*` · `.mcp.json` · `.nvmrc` · `.github/dependabot.yml` · editor configs · `CLAUDE.md` | Anything under `src/`, `public/locales/`, `theme.ts` · `package.json` deps + `bun.lock` · `.github/workflows/*` · `next.config.js` · `tsconfig.json` |

Rule: **inward, reversible, verifiable → automate. Outward-facing / production / design
judgment → approve first.**
