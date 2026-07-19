# Plan — Redesign-First + Chakra v3 / Dependency Migration for tylerpweb.dev

## Goal

Ship the redesigned Chakra-v3 / Next-16 site to production as **one reviewed,
preview-verified merge** into `main`, with each risky change isolated on its own PR so
any regression is bisectable.

`tylerpweb.dev` is a single-page portfolio **in production** (Pages Router, 13 i18n
locales via next-i18next + Crowdin). Three large changes, sequenced **redesign-first**:

1. **Chakra UI v2 → v3** — ✅ done (PR1 #19, on Next 13.4.5).
2. **Redesign** to the approved Claude Design (ID `3888fdd5-74ed-4b01-9f59-d3c985e1ddde`)
   — 🔄 **active phase** (per-section PRs into `modernize-updates`).
3. **Deps incl. Next 13 → 16** — ⬜ last (PR3).

**Sequencing rationale:** the redesign is authored against Chakra v3, so it depends on
the Chakra migration. Chakra v3 does **not** depend on Next 16 (needs React ≥18, Emotion
11, both present), so v3 migrated on the existing Next 13.4.5 stack and Next 13→16
decouples to the final PR. Trade-off: `next`-attributable vulns aren't cleared until PR3.

## Fixed decisions (Tyler)

Keep all 13 languages · stay on Pages Router · Storybook first · React stays 18.2 ·
package manager **bun** (`bun@1.3.14`) · Node **24** LTS · redesign-first ordering ·
three sequential PRs into an integration branch · `main` protected, branch protection on.

---

## Current status

| Phase                                              | Status       |
| -------------------------------------------------- | ------------ |
| Step 0 — CI onto `main` (bun, Node 24, dependabot) | ✅ #14        |
| PR0 — Storybook safety net                         | ✅ #17        |
| PR1 — Chakra v2 → v3                               | ✅ #19        |
| PR2 — Redesign (per-section)                       | 🔄 **active** |
| PR3 — Deps + Next 13 → 16                          | ⬜ last       |

**PR2 progress** (fan-out lands as **one PR per section** into `modernize-updates`):

| Section                                                 | Status      |
| ------------------------------------------------------- | ----------- |
| Shared scaffolding (token map, JetBrains Mono, tab fix) | ✅ #22 / #24 |
| Work (`ProjectsSection`)                                | ✅ #25 / #26 |
| About                                                   | ✅ #28       |
| Contact (`ReachOutSection`)                             | ✅ #29       |
| Skills                                                  | ⬜           |
| Hero                                                    | ⬜           |
| Header (new `Header.tsx`)                               | ⬜           |
| Redesign sweep (retire `MainSection`, etc.)             | ⬜           |

Then **PR2 i18n**: new `en` strings + key extraction land per section (automated,
in-repo); the **Crowdin re-sync of the 12 non-en locales is a separate approval-gated
follow-up** (see i18n rule) that must not fire before full visual sign-off.

---

## Build sequence & effort gating

Each arrow is a CI-green gate. No two risky changes ride the same PR.

```
Step 0 CI → PR0 Storybook → PR1 Chakra v3 → PR2 Redesign (per-section) → PR3 Next 16
                                                                        → Vercel preview
                                                                        → integration→main PR
```

### `/effort` is a HARD GATE

The executor **cannot** run `/effort` (it is Tyler's command). At **every phase/step
boundary where the prescribed tier differs from the current session effort**, the
executor MUST: (1) stop before doing the work, (2) say plainly *"this step is `/effort →
X`; the session is at `Y` — please run `/effort X`"*, and (3) wait for Tyler to change it.
Fires in both directions (raise for judgment, lower for mechanical). Never assume "close
enough"; never silently run at the wrong tier.

**`/ultracode` is NOT an effort tier** — it means run the step as a multi-agent Workflow.
It requires Tyler's explicit opt-in each time (keyword in prompt, or session toggle on);
never self-launched. If declined, fall back to single-agent at `/high`.

**What is NOT gated:**
- **`/fast`** is a throughput toggle (Opus, faster output — same model, same reasoning). It
  is outside this gate entirely: no step is conditioned on it, it never triggers a stop, and
  it composes freely with any effort tier.
- **PR2 per-section effort is advisory, not gated** (line 88): the blueprints rate Skills/
  Hero/Header as high-judgment, so `/high` is *recommended* and surfaced at each section —
  but the executor proceeds at whatever tier is set without stopping. The effort **gate**
  formally fires only at the **PR3 boundary → `medium`**.

### Effort routing

| Phase / step                                                  | Effort                                                                     | Why                                                                                                                                                   |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Step 0, PR0                                                   | ✅ done                                                                     | —                                                                                                                                                     |
| PR1 (incl. `theme.ts` rewrite)                                | ✅ done                                                                     | —                                                                                                                                                     |
| **PR2 — redesign** | `/high` **recommended, advisory (not gated)** | Blueprints rate the sections high-judgment; surface the recommendation, proceed at whatever tier is set. The `ultracode` fan-out applies to research/verification, not the serial build |
| PR2 section build | single-agent, **serial** per section | Builds can't fan out — Skills/Hero share `index.tsx` + Hero edits `theme.ts`, and Header must land after the ids it links to exist. Blueprint *research* fanned out; the build is serial |
| PR2 per-section verification sweep | Workflow — needs `ultracode` opt-in | Within one section, breakpoints × a11y × axe-blind-spot contrast are independent → fan-outable |
| **PR3 — deps + Next codemod**                                 | **`/effort` → `medium`** (raise to `high` only on manual config conflicts) | Codemod-driven, build-verified. **The effort gate resumes here.**                                                                                     |
| Pre-production cross-cutting review before integration→`main` | **Workflow — needs `ultracode` opt-in**                                    | Multi-agent adversarial verify at the production gate                                                                                                 |

---

## PR2 — Redesign (active)

**On Next 13 + Chakra v3.** Sections build to `Portfolio.dc.html`; tokens come only from
`DesignSystem.dc.html` (see design-source rule). Each section is a fresh branch off
`modernize-updates`, built under the `storybook:stories` workflow, and lands as its own
PR with its own Chromatic diff.

**Per-section shape** (established by the merged Work/About/Contact):
1. Read the section's authoritative layout from `Portfolio.dc.html` via DesignSync.
2. Build to the band-shell pattern: a full-bleed `<Flex as="section" id="X">` with the
   alternating `bg.canvas`/`bg.band`, an inner shell at `maxW="container.page"` +
   `px="clamp(20px,5vw,32px)"`, a mono kicker + `h2`, then content. Redesigned sections
   render their **own** `<section>`; **`MainSection` is frozen legacy** — do not extend it.
3. Re-string copy as `t()` keys in `public/locales/en/*` (in-repo half only).
4. `storybook:stories` governs every edit; stories-first if the section has lazyMounted/
   uncovered subtrees. Keep each section's `#anchor` guard story.
5. Verify: typecheck + `run-story-tests` (play + axe) green, then publish the visual
   review for Tyler's sign-off before commit.

### Remaining sections — build order & decisions

Blueprints were produced by an ultracode fan-out (3 research agents + a completeness
critic, grep-verified). **Build order is serial: Skills → Hero → Header.** The *research*
fanned out; the *build* cannot — the sections share mutation points, so parallel worktrees
would collide:

- **`src/pages/index.tsx`** — Skills and Hero each remove a different `MainSection` wrapper
  from it (same import/JSX lines). Serialize to avoid a merge conflict.
- **`src/lib/theme.ts`** — Hero adds a `heroWide` container condition + regenerated typegen.
- **Anchor contract** — Header links to `#about/#skills/#work/#contact`; it lands **last** so
  every target id exists in redesigned form and its Chromatic snapshot is over finished
  sections. Each section is still its own PR with its own human Chromatic accept, so the
  merge+accept gate is serial regardless of build parallelism. (Within a single section,
  the PR2-step-4 verification sweep — breakpoints × a11y × contrast — *is* fan-outable.)

1. **Skills** — band shell on `bg.canvas`; mono kicker + h2 + desc; commit-rail SVG
   (desktop, via the themed `@container skills`) / commit-chip grid (mobile). Retires the
   Skills/Work `MainSection` wrapper + deletes the legacy `Separator`. **Decisions:** desc →
   `fg.muted`, rail sha → `fg.subtle` (named tokens); brand colors in a local `SKILLS` array;
   skill names stay literals; keys `skills-kicker`/`skills-desc` add, `skills-title` change.
   **Before building: verify `ProjectsSection/index.tsx`'s direct `MainSection` import** — the
   blueprints assumed "ProjectsSection self-bands"; removing the outer wrapper must not
   strand Work's padding.
2. **Hero** — band shell with the two-layer positioned radial as a **raw `bgImage`** (not
   `bgGradient` — keyword shorthand can't express `at 78% -10%`); mono kicker, `display` h1
   with a teal `<span>` on "Tyler", amber→#work + teal-outline→#contact CTAs, 4 text social
   pills. **Deletes `SocialLinksList`** (Hero's only consumer) + fixes the stale `data.ts:12`
   comment. Adds `heroWide` to theme (`bun run theme`). **Defers** the animated branch-graph
   SVG (keep static `version-control.svg`); **leaves** the dead `waggle` keyframe for the
   sweep. Keys: `hero-site-title` → `<0>Tyler</0>`, add `hero-cta-contact`/`hero-social-label`,
   remove `hero-page-scroll-notice`, Email pill label via `t()`.
   - **🔶 KNOWN DESIGN ISSUE — circle back (Tyler flagged 2026-07-18):** the Hero
     column→row switch is a **container query** (`heroWide = @container hero (min-width:900px)`),
     but the design uses a **viewport `@media (min-width:900px)`**. The container query fires
     **~64px late** (container width = viewport minus the section's h-padding), so the columns
     stay stacked from ~900–964px viewport where the design has already gone side-by-side.
     The gradient-contrast structure requires the container be an outer wrapper with the switch
     on an inner child (an element can't respond to its own container query). Decision: **keep
     the container query for now**; the offset is a design-fidelity gap to resolve later
     (either switch Hero to a viewport breakpoint at 900px, or accept the offset). Do not add a
     new viewport breakpoint without Tyler's sign-off.
3. **Header** — new stateful `Header.tsx`: sticky blurred nav, TP gradient badge, desktop
   links + Contact pill, mobile hamburger + dropdown (`useState`, `aria-expanded`,
   Escape-to-close, **focus-return-to-toggle on close — required**). Raw rgba header/border
   alphas stay raw (`.78`/`.12`/`.22` — `border.subtle` is `.14`, a wrong-substitution trap);
   999px Contact pill built locally, not from the button recipe. **This PR owns
   `scroll-margin-top`** on section ids (the sticky header creates the occlusion). Hand-built
   hamburger (no react-icons). Keys: `header-brand-name`, `header-nav-*`, `header-menu-toggle-label`.

**Do NOT delete `MainSection.tsx`** in Skills or Hero — it stays until the sweep removes the
last consumer. All three remaining sections have an **axe contrast blind spot** (Skills SVG
rail, Hero radial, Header blur): axe goes "incomplete" (silent pass), so flag + hand-verify
those ratios — see the `gradient-contrast-axe-gap` memory. The two `op:"change"` i18n keys
leave the 12 non-en locales structurally stale → feeds the approval-gated Crowdin re-sync;
**do not sync.**

**Irreducibly human at the end — do not automate:**
- **Chromatic UI Tests accept** — `exitZeroOnChanges: true` keeps the job green, but the
  check stays pending until a human accepts. In a redesign every story diffs.
- **Copy/content + final visual sign-off.**
- **Merge approval** into `modernize-updates`.

---

## PR3 — Deps + Next 13 → 16 (last)

Pages Router, on the redesigned Chakra-v3 tree. **`/effort` → `medium`.**

1. `npx @next/codemod@canary upgrade latest`.
2. Bump `next`, `eslint-config-next`, `@types/*`; keep React 18.2. Node 24 + TS 5.1.3
   already clear Next 16's floors.
3. Check `next-seo` compat with Next 16.
4. Re-verify the redesign renders **unchanged** post-upgrade (Storybook visual-diff vs.
   the PR2 baseline; the codemod touches Next internals, not Chakra).
5. **Vuln pass — measure with `bun audit`, NOT Dependabot** (see dependencies rule for
   why Dependabot is structurally blind here). Against the 2026-07-15 baseline of **53
   rows (2 critical, 21 high, 24 moderate, 6 low)**:
   - The **26 `next` rows** clear with the Next bump — that is its whole vuln contribution.
   - **Bump `next-i18next`** to clear `i18next-fs-backend`'s CRITICAL — a real prod runtime
     vuln Next 16 does not touch and Dependabot cannot see. Highest-priority dep item.
   - **Fix the `dependencies`/`devDependencies` misclassification** (`eslint`, `typescript`,
     `eslint-config-next`, `@types/*` sit in `dependencies`) so `bun audit --prod` means
     something.
   - **Add `bun audit` to `ci.yml`** — without it there is no vuln gate at all.
6. `bun run build` + run app. **Gate → final.**

Then: Vercel preview of `modernize-updates` → multi-agent Workflow cross-cutting review
(needs `ultracode` opt-in) → Tyler's final visual sign-off → single integration→`main` PR.

---

## Approval checkpoints

The executor runs automated work freely between these, but **stops for Tyler's explicit
approval at each**:

1. ✅ Step 0 yarn→bun switch (done).
2. **Each dependency add/remove/upgrade** (PR3: `next`, `eslint-config-next`, `@types/*`,
   `next-i18next`). Pre-cleared for PR2: `@fontsource/jetbrains-mono`, `@crowdin/cli`.
3. ✅ `theme.ts` token naming (satisfied for PR2 — the 9-swatch map is verified). Re-gate
   only if PR2 needs a token not on the map.
4. **Crowdin re-sync / locale change** — external, published. Carved out of the PR2 run.
5. **Merging any PR into `modernize-updates`** — after CI green + a `code-review` of the
   diff, then Tyler's go.
6. **Redesign copy/content + final visual sign-off.**
7. **The integration→`main` PR** — production; always PR + approval.

Rule: **inward, reversible, verifiable → automate. Outward-facing / production / design
judgment → approve first.**

---

## Enforcement — `.claude/rules/*` (auto-load on matching file reads)

| File               | Scope                                               | Enforces                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `branch-safety.md` | always                                              | Branch model; PRs target integration never `main`; commit/push/merge/force-push gates; direct-push vs. PR table                                                                             |
| `dependencies.md`  | always                                              | Dep changes need approval; don't reintroduce dropped deps; `bun audit` (not Dependabot) is the vuln gate                                                                                    |
| `chakra-v3.md`     | `theme.ts`, `src/components/**`, `src/lib/icons/**` | `createSystem`; `<Provider value=>`; `gap` not `spacing`; `as="<html>"` vs `asChild`; colors in `tokens` (fg/border collisions in `semanticTokens`); **typecheck can't catch a dead token** |
| `i18n.md`          | `src/components/**`, `public/locales/**`            | Every string is a `t()` key; update `en` source; Crowdin re-sync approval-gated                                                                                                             |
| `components.md`    | `**/*.{tsx,jsx}`                                    | Story-first (`storybook:stories` before any component change); CI gates; a11y blind spots                                                                                                   |
| `design-source.md` | (redesign work)                                     | Tokens/layout only from design project ID `3888…`; other design projects out of scope                                                                                                       |
| `dev-server.md`    | (local runs)                                        | `bun run dev:incognito` is the primary local dev script                                                                                                                                     |

The MCP servers live in `.mcp.json` (chakra-ui, react-icons, next-devtools, crowdin).
Crowdin needs `CROWDIN_PERSONAL_TOKEN` + `CROWDIN_PROJECT_ID` exported (Claude Code has no
`${input:...}` prompt — env-var only).

---

## Design reference

**Source of truth:** tokens from `DesignSystem.dc.html`, layout from `Portfolio.dc.html`,
both in the Claude Design project **ID `3888fdd5-74ed-4b01-9f59-d3c985e1ddde`** (match the
ID, not the name). Do not consult any other design project. See design-source rule.

**Token map (design → v3, verified 1:1 against 9 swatches):** Canvas `#0b1617`→`bg.canvas`
· Surface `#0f1e20`→`bg.surface` · Band `#122527`→`bg.band` · Teal `#33a6c0`→`accent.solid`
· Teal-bright `#56c4da`→`accent.emphasis`/link · Amber `#f2b544`→`warm.solid` · Ink
`#eaf3f2`→`fg` (DEFAULT) · Line `#56c4da24`→`border.subtle`. The `fg` ramp:
`fg.muted`=`#a9bab9` (not the declared-but-unused `#a3b5b4`), `fg.subtle`=`#7a9ea0`,
`accent.muted`=`#7fb6c2`. Fonts: Titillium / Mulish / JetBrains Mono, self-hosted via
`@fontsource/*` as `--font-tw`/`--font-mulish`/`--font-mono` at `:root`.

**Unnamed design greys** (~9, e.g. `#c6d5d4`) are used raw at call sites, matching the
merged card conventions — not yet promoted to tokens.

**Skills brand colors** (new per-skill data for the commit rail): HTML5 `#E34F26` · CSS3
`#1572B6` · JavaScript `#F7DF1E` · SASS `#CC6699` · Bootstrap `#7952B3` · VueJS `#42B883` ·
ReactJS `#61DAFB` · GatsbyJS `#8A4BAF` · TailwindCSS `#38BDF8` · Chakra UI `#2F9E9B` ·
NextJS `#cfd8d7`.

---

## Verification

- **Each PR:** CI green + `verify`/`run` the app; visual-diff the affected sections in
  Storybook; `code-review` the diff before merge.
- **Chromatic (#20)** is the only gate that sees visual regression. `exitZeroOnChanges:
  true`, so its "UI Tests" check is the human-accept review gate. Baseline = build 77
  (`c46544d`); every fan-out branch resolves it via git ancestry.
- **Pixel-diff against a baseline build** for anything subtle: build the previous branch's
  Storybook in a `git worktree`, serve both, compare computed styles + screenshots with
  headless Chromium. This caught PR1's 16 regressions where all four other gates were green.
- **PR3:** redesign renders unchanged post-Next-16 + `bun audit` vs. the 53-row baseline
  (expect only the 26 `next` rows to clear).
- **Before `main`:** Vercel preview → multi-agent Workflow cross-cutting review (needs
  `ultracode` opt-in) → Tyler's final sign-off → the single integration→`main` PR.

---

## Completed phases — detail & hard-won lessons (archive)

### Step 0 — CI (PR #14 → `main`)
yarn→bun (`bun@1.3.14`), Node 24 pinned, `typecheck` added, husky + CLAUDE.md on
`bun run`, `ci.yml` + `dependabot.yml`. CI green on the v2 baseline; `bun run theme` works
as-is. Branch protection on `main` enabled by Tyler. Integration branch =
`modernize-updates`.

**Two unplanned branches landed before PR1**, both from failures the planned gates
couldn't see:
- **#18 self-host-fonts** — `next/font/google` fetches at build time and intermittently
  ETIMEDOUTs on Vercel. Switched to self-hosted `@fontsource/*`. **Never `next/font/google`.**
- **#20 ci/chromatic** — visual-regression gate. PR1 passed every gate while 16 real
  visual regressions sat in the diff; Chromatic is the only check that sees that class.

**Vuln re-baseline (2026-07-15):** Dependabot went blind when `yarn.lock` was deleted —
it sees 38 of ~937 packages and attributes all alerts to `next`. The apparent 65→26
"improvement" was **measurement loss, not remediation**. True baseline via `bun audit`:
53 rows. 26 are `next` (clear in PR3); 27 are transitive + invisible to Dependabot, incl.
a CRITICAL in `i18next-fs-backend`. **Dependabot cannot gate this bun tree — use `bun
audit`.** (Full detail in dependencies rule.)

### PR0 — Storybook (PR #17)
Storybook 10.5 + stories for all sections. **Deviation:** `@storybook/react-vite`, not
`@storybook/nextjs-vite` (SB10's Next framework needs Next ≥14.1); `next/image` stubbed via
`.storybook/mocks`. Revisit at PR3. Required `tsconfig` `moduleResolution: bundler`.

### PR1 — Chakra v2 → v3 (PR #19, merged)
Chakra v3.36.0 live on Next 13.4.5.

**The load-bearing lesson (binds PR2/PR3): "typecheck passes" is near-ZERO signal for a
v3 token migration.** Every token-taking prop also accepts an arbitrary string, so a dead
token compiles clean and the browser silently discards it. All four gates were green while
16 regressions sat in the diff. **Green CI ≠ visual correctness — that's what Chromatic is
for.**

**Root-cause class to expect again:** v2's `extendBaseTheme` emptied `components`, so our
recipes were the only styles. v3's `createSystem(defaultConfig, …)` **merges Chakra's
default recipes**, supplying values v2 never had (outline button `colorPalette.fg`
near-black; `size.lg` textStyle clobbering fontSize; Link base `gap:1.5`; etc.) — all
invisible to the compiler.

**Deviations, all verified:**
- `@chakra-ui/codemod upgrade` is interactive, won't run headless → migration was
  compiler-driven, `spacing`→`gap` (18 sites) done by hand.
- **`as` → `asChild`** is the project convention (load-bearing: flattening `as={List}` to
  style props renders a `div`, killing `ul`/`li` semantics).
- **Colors in `tokens`, not `semanticTokens`** — `base` is the default-condition key there,
  so `primary:{base,dark}` never registers `primary.base`. **Inverts** for names v3 owns
  (`fg.muted`/`fg.subtle`/`border.subtle` → `semanticTokens`, else v3's `:root` gray wins
  on specificity).
- `sizes.container.*` re-added (v3 dropped the scale, unbounding `maxW` sites).
- **ACCEPTED visual change — Projects tabs:** v3 removed `enclosed-colored`; panel 8px
  taller. Tyler accepted.
- Storybook fonts were never loading (vars set on a decorator `<div>`, too late for
  `:root` token resolution). Fixed via `.storybook/fonts.css` at `:root` — **keep those
  imports in `preview.tsx`**.
- Visual parity proven by **pixel-diffing every section vs. a v2 baseline** (About/Contact/
  Skills = 0px, Hero = 7px sub-pixel arrow centering) — reuse this in PR2/PR3.

### PR2 scaffolding (already shipped, #22/#24)
Token map + JetBrains Mono + the tab fix. **3 of the 11 tokens were dead as first
specified** (`fg.muted`/`fg.subtle`/`border.subtle` collided with v3 defaults on `:root`
specificity) — fixed by moving them to `semanticTokens`. The probe:
`system.tokens.cssVarMap` (>1 condition = a default is contending). Full mechanism in
chakra-v3 rule.

