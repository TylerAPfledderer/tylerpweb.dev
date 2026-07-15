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
- **Pixel-diff against a baseline build** for anything subtle — build the previous
  branch's Storybook in a `git worktree`, serve both, compare computed styles +
  screenshots with headless Chromium. This is what actually caught PR1's 16 regressions;
  it localises a diff to an element and property in a way Chromatic thumbnails cannot.

## Storybook stubs Next, and the stub can rot silently

`next/image` and `@chakra-ui/next-js` are both aliased to `.storybook/mocks/*` because the
react-vite builder has no Next runtime — unstubbed, `next/image` throws
`ReferenceError: process is not defined` at module scope.

**PR1 broke the stub without anyone noticing, for a year of commits.** The alias targeted
`@chakra-ui/next-js`; PR1 removed that package and moved `ProjectItemCard` to a direct
`next/image` import, so the alias matched nothing. It never failed because the only
importer sits behind the Projects tab, and Tabs uses `lazyMount` + `unmountOnExit` — **no
story ever mounted a project card, so Chromatic never baselined one.** Fixed in PR2 (#22)
by adding `mocks/next-image.tsx` + its alias.

Lesson: **a lazyMounted subtree is invisible to every gate.** If a story never reaches a
component, neither typecheck, nor build, nor Chromatic says anything. Write a story that
actually drives the interaction.

## Accepted visual deltas — do not "fix" these

- **Projects tabs.** v3 removed the `enclosed-colored` variant; the section uses
  `enclosed`. Panel is 8px taller (~7% pixel diff). Tyler accepted this.
  **Superseded in part by PR2 (#22):** the tabs are now pinned to design tokens
  (`Tabs.List` → `bg.surface`; trigger → `fg.muted`, `_selected` → `accent.solid` /
  `bg.canvas`) so they inherit no v3 default surface. Idle 8.49:1, selected 6.45:1.
- **PR2 `fg` tier collapse.** The ~12:1 neutral tier collapses into `fg.muted` (9.12), so
  long-form body copy dims slightly. Intentional. Expect it when pixel-diffing.
  > **The tab half of this prediction was wrong — do not reuse its reasoning.** It said
  > the idle tab label drops 10.71 → 9.12, measured **against the dark canvas**. The tab
  > was never on the canvas: v3's recipe put it on a `bg.muted` (`gray-100`) list, so the
  > real number was **1.84:1**, a WCAG failure. Measure a contrast delta against the
  > element's *actual* backdrop, not the surface you assume it sits on.
