---
name: storybook-stories
description: The story-first workflow governing every frontend component change in tylerpweb.dev — writing, editing, restyling, refactoring, renaming, or DELETING anything under src/components/, src/lib/icons/, src/lib/theme.ts, or .storybook/. Invoke this BEFORE touching a component, not after, and invoke it even when the change looks cosmetic-only, internal, a pure refactor, or "no behavior change" — that judgment is exactly what this skill exists to make for you. Use it whenever the task involves a section component, a story file, Chromatic modes or snapshots, story tests, axe/a11y results, a Chakra v3 recipe or token change that renders, or any question of the form "will this be caught by a gate?".
---

# Story-first component changes

Storybook is this repo's safety net. The site is **in production** on a protected `main`,
and it is mid-redesign, so the only thing standing between a change and a silent visual
regression is whether a story renders the thing you changed.

The rule that matters most: **you do not get to decide a change is too small for this
workflow.** The repo's history is a list of changes that looked cosmetic and were not —
a stub alias that matched nothing for a year, a tab label at 1.84:1 that a green a11y run
never mentioned, a `69px` header offset that arithmetic said was right. Each was invisible
because no story drove it.

## Relationship to the `storybook:stories` plugin

If the Storybook team's `storybook:stories` plugin skill is available in your session, use
it too — it carries the generic mechanics of writing a story (CSF shape, args, play-function
idiom) across React/Vue/Svelte, and it is better at that than this file.

**This skill is the one the repo mandates, because it is the one that always resolves.**
It lives in `.claude/skills/`, so it is part of the clone and reaches every contributor and
every cloud session. That plugin is enabled per-account in user settings, which do not
travel: a cloud session, a fresh machine, or another contributor sees the mandate but not
the skill. This repo hit exactly that — four files required a workflow that could not be
invoked, and nothing reported it.

So: this file owns *what this repo requires and why its gates lie*. The plugin, when
present, owns *how to write the story*. Neither replaces the other.

## The core question, asked before you edit

> **After my change, which gate would actually fail if I got this wrong?**

If the honest answer is "none", stop and write the story first. That is the whole method.
Everything below is detail on how each gate is blind.

## What the gates can and cannot see

| Gate | Sees | Blind to |
|---|---|---|
| `bun run typecheck` | Type errors | Dead theme tokens — a token that no longer exists still typechecks and renders as nothing |
| `bun run lint` | Lint rules | Everything visual |
| `bun run build-storybook` | Build breakage | Docgen quality; it exits 0 and says "completed successfully" either way — `bun run oversight` is what sees this |
| `bun run test-storybook` (play + axe) | What a story **renders**, at **one width** | Unmounted subtrees; anything at another breakpoint |
| `bun run oversight` | The MCP components manifest — whether docgen reached it, per component | Anything a story renders; it lints docs, not pixels. **Not in `ci.yml`**, so it only runs when you run it |
| Chromatic | Visual diffs, per mode | Nothing, but `exitZeroOnChanges: true` means the job is always green — the "UI Tests" check is the real gate and needs a human |

Two of these deserve their own sections because their failure mode is silence, not red.

### A lazyMounted subtree is invisible to every gate

`ProjectsSection`'s tabs use `lazyMount` + `unmountOnExit`. For a year, no story ever
mounted a project card. The consequence was not one bug but a category: axe never audited
the card, Chromatic never baselined it, and the `next/image` stub broke in PR1 without a
single gate noticing, because the only importer was behind a tab.

So: **if a component is only reachable through an interaction, it does not exist to CI.**
Give it its own story whose `play` function actually drives the interaction. Do not infer
coverage from a green tick on the parent section.

### Axe goes silent rather than failing when it cannot resolve a backdrop

This is the subtlest trap here. Axe **declines to measure** contrast when the effective
background is undeterminable — a gradient, a skewed `::before`, text over an SVG — and
reports "incomplete", which passes. `AboutMeSection` carried the identical 4.29:1 failure
that CI *did* fail on `ReachOutSection`, and stayed green.

**A green a11y run over such an element means "not measured", not "passes".** When text
sits on a gradient, an image, an SVG, or any layered background, compute the ratio by hand
against the *actual* backdrop and record it. Measuring against the surface you assume the
element sits on is how the tab-contrast prediction went wrong: the tab was never on the
canvas, it was on v3's `gray-100` list, and the real number was 1.84:1.

## Sequencing: baseline before you restyle

Chromatic can only show you a diff if a baseline exists. A restyle that also introduces
the story arrives as a brand-new snapshot with nothing to compare against, and the review
degrades to "does this look fine?" instead of "what changed?".

When a component has no story yet and you are about to restyle it, split the work:

1. **PR A — stories only.** No component, theme, or data changes. This baselines the
   current appearance. (`#25` did exactly this for the two card components.)
2. **PR B — the restyle**, which Chromatic now diffs against PR A's baseline.

Within a section that already has coverage, keep the same instinct: land coverage for an
uncovered subtree before changing how it looks.

## Chromatic modes stack — they never substitute

`preview.tsx` sets project-level `chromatic.modes` from `breakpointModes`, so every story
is captured at all seven widths. A per-story `modes` object is **combined** with that set,
not swapped for it. Listing only the modes you want therefore does nothing.

The only way to drop an inherited mode is `{ disable: true }`. `Header.stories.tsx` is the
reference implementation: it derives the mode names from `breakpointModes` and slices them
at `nav` **by position**, so *moving* a breakpoint in `theme.ts` carries both halves with it.
A hand-listed set silently keeps snapshotting a width that no longer exists.

**Renaming `nav` is the unguarded case, and it fails silently.** The slice point is
`modeNames.indexOf("nav")`, which returns `-1` when the name is gone — so `slice(0, -1)` and
`slice(-1)` *invert* the halves: 6 of the 7 modes land in `DISABLE_MOBILE` and only `2xl` in
`DISABLE_DESKTOP`. That is build 113's failure again, reached by a different route. If you
rename that breakpoint, update both `theme.ts` and the story, and consider making a missing
index throw rather than resolve to `-1`.

Build 113 is the cautionary tale: `MobileMenuOpen` listed only mobile modes, inherited the
desktop ones anyway, and ran its play function at five widths where the hamburger is
`display: none` — so `getByRole` threw and the interaction test failed.

**A green local run is not evidence a mode is right.** `test-storybook` runs at one width
and never touches the mode stack.

## What belongs in a play function

Assert **behavior and semantics** — that a link exists, that a panel opens, that every item
in the data renders. Leave visual correctness to Chromatic; it is far better at it, and a
`getComputedStyle` assertion mostly re-tests the theme.

Two exceptions the repo does make, deliberately:

- **Anchor guards.** Each section pins its own `#id`, and `Header` pins that it links to
  all five. A typo there breaks navigation with no error, no failed typecheck, no diff —
  Chromatic cannot see a wrong `href`.
- **A `CssCheck` story** where a specific token resolution is the thing at risk (a band
  resolving to `bg.canvas`), because a dead token typechecks fine.

When a story exists to give Chromatic something to capture, **end the play function in the
state you want captured.** `MobileMenuOpen` opens the panel and deliberately stops; closing
it again would leave Chromatic snapshotting the closed state forever.

## Layout traps vitest and axe cannot see

Some breakage is invisible to every automated gate but obvious in a browser. Check these by
actually rendering, at real widths:

- **Container queries.** An element cannot respond to its own container query — the
  `containerType`/`containerName` goes on the outer box and the switch lives on an inner
  child. Also note a container query is *not* a viewport media query: the container is the
  viewport minus horizontal padding, so a `900px` design breakpoint fires late.
- **`flexDirection` on Chakra v3 list recipes.** `List.Root` hardcodes `column`, and that
  wins through `asChild`. An explicit `flexDirection="row"` is load-bearing wherever a list
  should lay out horizontally — this has bitten both the Work OSS list and the Hero social
  pills.

`bun run dev:incognito` runs the real site; a headless Chromium against a built Storybook
works too, and is what actually caught both bugs above.

## Working checklist

1. Identify every component the change touches, **including ones only reachable through an
   interaction**.
2. For anything uncovered, write the story first — and if you are about to restyle it,
   land that story as its own PR so a baseline exists.
3. Make the change. Keep the section's anchor-guard story intact.
4. Run `bun run typecheck`, `bun run lint`, `bun run test-storybook`, and — if you touched
   a component's docs, props, or JSDoc — `bun run build-storybook && bun run oversight`,
   since no CI job covers that one. Treat a green axe
   result over a gradient, image, or layered background as unmeasured, and verify those
   ratios by hand.
5. Check any container-query or flex-direction behavior in a real browser.
6. Confirm the Chromatic mode set is what you intended — remembering that per-story modes
   add to the project set, and only `{ disable: true }` removes one.
7. Expect every redesign story to diff, and say so. **Chromatic needs a human to accept;
   a machine cannot sign off on a new look.**

## Deleting a component

Deletion is a component change and runs this workflow too. Remove its stories with it, and
check for consumers first — `SocialLinksList` survived two redesign PRs because Hero still
imported it after Contact stopped. `MainSection` is frozen legacy pending deletion: do not
extend it or add consumers.
