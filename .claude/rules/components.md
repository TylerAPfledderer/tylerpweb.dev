---
paths:
  - "src/**/*.tsx"
  - "src/**/*.jsx"
  - ".storybook/**"
---

# Components — story-first

**Invoke the `storybook:stories` skill BEFORE touching any frontend component** — before
writing, editing, or deleting, so the workflow governs how the change is made. This holds
even if the change looks cosmetic-only, internal, a refactor, a rename, or "no behavior
change." That judgment is not ours to make.

Storybook (10.5) is the safety net that makes every section visually diff-able through the
migration. Stories exist for all sections.

## Storybook framework: `@storybook/react-vite`, not `@storybook/nextjs-vite`

Deliberate (PR0/#17). SB10's Next framework needs Next ≥14.1; this repo is on Next 13.4.5.
`next/image` is stubbed via a `.storybook/mocks` alias. **Revisit at PR3**, once Next 16
lands.

`tsconfig` uses `moduleResolution: "bundler"` (SB10 subpath exports require it).

## Verification

- `build-storybook` is the CI gate. The vitest browser tests (play / CssCheck assertions)
  are **not** in CI — cold-cache Vite dep re-optimization makes the first run flaky.
- **Chromatic (#20) is the only gate that sees visual regression.** `exitZeroOnChanges:
  true`, so the job never fails on a diff — Chromatic's own "UI Tests" check is the review
  gate and stays pending until a human accepts. In a redesign every story diffs; a machine
  cannot sign off on the new look.
- **Baseline Chromatic before redesigning**, then diff against it.
- **`a11y: { test: 'error' }` in `preview.tsx` does NOT gate CI.** The addon's own comment
  says `'error'` = "fail CI on a11y violations"; that is **false for this repo**, because
  CI never runs vitest (see the bullet above). It only bites where story tests actually
  run. The real CI gate for accessibility is **Chromatic's accessibility tests**, which
  run axe on the Storybook build `chromatic.yml` already uploads and mark the PR
  unreviewed on a *new* violation (pre-existing ones get baselined, like visual diffs).
  They must be **enabled from the Chromatic project's Manage page** — a settings action,
  same class as branch protection, not doable in-repo.
- **Pixel-diff against a baseline build** for anything subtle — build the previous
  branch's Storybook in a `git worktree`, serve both, compare computed styles +
  screenshots with headless Chromium. This is what actually caught PR1's 16 regressions;
  it localises a diff to an element and property in a way Chromatic thumbnails cannot.

## Accepted visual deltas — do not "fix" these

- **Projects tabs.** v3 removed the `enclosed-colored` variant; the section uses
  `enclosed`. Selected-tab chrome is `bg.muted` rather than white, panel is 8px taller
  (~7% pixel diff). Tyler accepted this; the redesign restyles these tabs anyway.
- **PR2 `fg` tier collapse.** The ~12:1 neutral tier collapses into `fg.muted` (9.12), so
  long-form body copy dims slightly and the idle tab label drops from 10.71 → 9.12.
  Intentional. Expect it when pixel-diffing.
