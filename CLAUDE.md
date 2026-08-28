# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Task tracking — Amazing Marvin is the live list

**Before starting work, check Marvin.** It is the source of truth for what is open,
blocked, and next. `PLAN.md` holds decisions and rationale only — it is not a task list.

- **Project:** `tylerpweb.dev updating` — id `2b07665547615c0bc66b05f67c08439f`, via the
  `amazing-marvin` MCP.
- **Sub-projects:** A — PR2 Redesign sweep · B — PR2 i18n close-out · C — PR3 Deps and
  Next 13→16 · D — Pre-production gate to main · E — Known issues / deferred.
- `marvin_list_children` on a sub-project id lists its tasks (one level deep only).
- **Work Session signal:** if a task is scheduled for today or sits in a time block, treat
  it as the intended focus for the session and start there.

**Labels encode gates:** `needs-approval` (Tyler must approve before proceeding),
`blocked`, `human-only` (cannot be automated — e.g. the Chromatic accept).

**Marvin API caveats — do not trust an HTTP 200 as proof of a write:**
- `marvin_mark_done` returns `done: true` without the change reliably reaching Marvin's
  clients. Read back before reporting a task complete, and prefer completing tasks in the
  app.
- `marvin_update_document` **stringifies every value it writes** — an integer
  `timeEstimate` becomes `"1800000"` and an array `labelIds` becomes `"[\"id\"]"`. Set
  those fields at creation time via `marvin_create_task` (which stores correct types), or
  edit them in the Marvin UI. Verified 2026-08-10.
- Rate limit ~1 query/3s and ~1 create/s, and the limiter **throws** rather than queueing.
  Sequential calls only.

## Commands

```bash
bun run dev            # Start development server
bun run dev:incognito  # Preferred local run — waits for :3000, opens a fresh incognito window
bun run build          # Build for production
bun run lint           # Run ESLint (also runs automatically via Husky pre-commit hook)
bun run typecheck      # Type-check with tsc --noEmit
bun run theme          # Generate Chakra UI theme tokens from src/lib/theme.ts
bun run theme:watch    # Watch and regenerate theme tokens on change
```

**bun only** — never `yarn` or `npm` (`yarn.lock` was removed in #14).

## Architecture

This is a single-page portfolio website built with Next.js 13 (Pages Router), TypeScript, and Chakra UI **v3**. The site is **in production**; `main` is protected and continuously deployable.

### Page Structure

The entire site is a single page (`src/pages/index.tsx`) composed of a sticky header plus sequential section components:
- `Header` → `HeroSection` → `AboutMeSection` → `SkillsSection` → `ProjectsSection` → `ReachOutSection`

Each redesigned section renders its **own** full-bleed `<section>` using the band-shell
pattern (alternating `bg.canvas`/`bg.band`, inner shell at `maxW="container.page"`, a mono
kicker + `h2`, then content).

`MainSection` is **frozen legacy pending deletion** — it has no remaining consumers and the
sweep removes it (Marvin task A1). Do not extend it or add new consumers.

### Internationalization

The site supports 13 languages via `next-i18next`. Translation files live in `public/locales/<lang>/` with three namespaces:
- `common` — general UI strings
- `projects-item-data` — project descriptions
- `open-source-data` — open source contribution descriptions

Crowdin is configured (`crowdin.yml`) to sync translations from `public/locales/en/` as the source.

### Storybook & visual regression

Storybook (`@storybook/react-vite`) is the primary verification gate — **not** the Next
framework, which needs Next ≥14.1 and is revisited in PR3 (Marvin task C7).

- The `storybook-stories` skill governs **every** component change, including deletions and
  changes you judge cosmetic. Invoke it before editing a component, not after.
- **Chromatic** is the only gate that sees visual regression. `exitZeroOnChanges: true`
  keeps the job green, so its "UI Tests" check stays pending until a human accepts.
- Chromatic **stacks** modes: a per-story `chromatic.modes` entry is combined with the
  project-level set in `preview.tsx`, never substituted. The only way to drop an inherited
  mode is `{ disable: true }` — see `Header.stories.tsx` for the reference implementation.
- Local story tests run at one width and never touch Chromatic's mode stack. A green local
  run is not proof a mode is correct.

### Theming

Custom Chakra **v3** theme is defined in `src/lib/theme.ts` via `createSystem`. Run
`bun run theme` after modifying this file to regenerate type definitions. The theme defines:
- Semantic color tokens on the redesign's 9-swatch map (`bg.canvas`, `bg.band`,
  `accent.solid`, `fg`, `border.subtle`, …). The legacy `primary`/`secondary` groups are
  referenced only in comments — no live usage remains.
- A legacy CSS Grid-based typography spacing scale (`text.sm`, `text.base`, …) with **one**
  remaining consumer, `src/pages/index.tsx:40` (the footer). Whether it is retired depends
  on the footer decision — Marvin task A4.

⚠️ **`bun run typecheck` cannot catch a dead token.** A token that no longer exists still
typechecks; it silently renders as nothing. Verify token changes visually.

### Path Aliases (tsconfig.json)

- `@/components/*` → `src/components/*`
- `@/data` → `src/lib/data.ts`
- `@/svg-icons` → `src/lib/icons/`

### Custom Icons

`src/lib/icons/` contains custom SVG React components for tech stack icons (React, Next.js, Vue, Chakra UI, Tailwind, etc.) not available in `react-icons`. All are exported from `src/lib/icons/index.ts`.
