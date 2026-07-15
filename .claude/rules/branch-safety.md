# Branch safety

**This site is in production.** `main` is protected and continuously deployable.

## Branch model

```
main (production, protected — CI check required)
 └─ modernize-updates          ◄── long-lived INTEGRATION branch
       ├─ chore/storybook-setup   PR0  ✅ merged (#17)
       ├─ fix/self-host-fonts          ✅ merged (#18)
       ├─ ci/chromatic                 ✅ merged (#20)
       ├─ refactor/chakra-v3      PR1  ✅ merged (#19)
       ├─ feat/redesign           PR2  ← current
       └─ chore/next16-upgrade    PR3
       └─ modernize-updates ─► main    single final PR, after all gates + Vercel preview
```

- Feature branches target **`modernize-updates`**, never `main`.
- **Into `main`: always a PR + Tyler's approval.** No exceptions.
- One risky change per PR, so any regression is bisectable.

## What may be pushed directly to the integration/working branch

Only docs/meta the built site cannot consume:

`PLAN.md` · `.claude/rules/*` · `.mcp.json` · `.nvmrc` · `.github/dependabot.yml` ·
editor configs · `CLAUDE.md`

## What requires a PR (CI-gated)

Anything under `src/`, `public/locales/`, `theme.ts` · `package.json` deps + `bun.lock` ·
`.github/workflows/*` · `next.config.js` · `tsconfig.json`

Rule: **inward, reversible, verifiable → automate. Outward-facing / production / design
judgment → approve first.**
