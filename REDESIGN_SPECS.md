# PR2 Redesign — Section Specs & Seams Review

_Generated 2026-07-15 from a 7-agent read-only spec pass (6 sections + 1 integration
reviewer) against `Portfolio.dc.html` / `DesignSystem.dc.html` and the installed Chakra
v3.36.0. Tree verified untouched afterwards._

Full agent output (261KB, every spec's `structure` / `tokens` / `i18n` / `risks` / `a11y` /
`storyPlan`):
`/tmp/claude-1000/-home-tylerapfledderer-web-development-tylerpweb-dev/96a31888-7653-474a-a5c1-1701baf8c82c/tasks/wz1dceu8k.output`

---

## Verified before trusting (I re-checked the claims that overrule a spec)

| Claim | Verdict | Evidence |
|---|---|---|
| `createBreakpoints` sorts, so insertion order is irrelevant | **TRUE** | `styled-system/breakpoints.js` → `sort(breakpoints)`. **Hero's "inverted cascade" premise is false.** |
| Layer order `reset(0) base(1) tokens(2) recipes(3)` | **TRUE** | `styled-system/layers.js`. A `globalCss` link fix **loses to the Link recipe** — a dead fix that typechecks. |
| Chakra `sm` = 480px, not the design's 640px | **TRUE** | `theme/breakpoints.js:3`. |
| v3 `Link` default variant is `plain` → `colorPalette.fg` | **TRUE** | `theme/recipes/link.js`. |
| `gray.fg` → `_light: gray.800` wins with no colour mode | **TRUE** | probed: `_light => var(--chakra-colors-gray-800)`. This is the 1.24:1 mechanism. |
| `globalCss` paints `html { bg: "background" }` = **#182326**, not `bg.canvas` #0b1617 | **TRUE** | `theme.ts:105`. **Invalidates Hero's whole contrast table.** |
| A custom `recipes.link` can beat the default | **TRUE (config-time)** | probed: `plain.color` overridden, `base` merge intact (`display`/`gap`/`focusVisibleRing`), `underline` survives. ⚠️ Config-time is **not proof** in this repo — verify in a browser in the shared PR. |

---

## The six sections

**Header** — NEW `src/components/Header.tsx`; sticky blurred bar, gradient TP mark +
wordmark, nav ≥640px / hamburger + dropdown panel below. Wraps **both** link sets in one
`<nav>` (the design leaves the panel's links outside the landmark). Two dead-on-arrival
traps caught in a real browser: `backdropBlur="lg"` + `backdropFilter="auto"` computes to
**`none`** (eight vars Chakra never defines) — use `backdropFilter="blur({blurs.lg})"`; and
an unstyled `<Link>` here renders **1.24:1**. Header's audit is the only one the seams
reviewer could not fault.

**Hero** — left-aligned two-column band at `id="top"`; kicker moves above the h1, graphic
becomes an inline animated SVG (visible on phone now), scroll notice + `CurvedDownArrow`
dropped. **Its contrast table is invalid** (measured against #0b1617; the page paints
#182326) and **its breakpoint reasoning is refuted** — both need redoing before build.

**About** — skewed teal slab → flat `#122527` band, hairlined, two gradient cards. Kills
`Highlight` (can't paint "beautiful" teal + "useable" amber — one `styles` object for all
queries) in favour of `<Trans>` + indexed components, which also **closes a live i18n bug**:
`about-title-highlight-1/-2` need each of 12 translators to emit an exact substring match,
and a miss silently drops the highlight with every gate green.

**Skills** — decorative scatter → **commit rail**; container query at 820px (not a viewport
query) swaps chips → SVG rail. Correction: "icons are monochrome" is **false** — all 11 are
already brand-coloured, 7 via `createIcon` `defaultProps.color`, 4 via hardcoded `fill`, and
**every one differs from the design's hex**. That's a second source of brand truth, not
missing data.

**Work** — `bg.band` band, pill toggle, OSS gradient cards + a `minmax` project grid.
**Keep Chakra `Tabs`; switch `enclosed` → `subtle`.** `segment-group` is a radio group
(`role="radiogroup"`, real inputs) and would need hand-rolled panel wiring; `plain` is a
trap — its `[data-selected][data-ssr]` selector is (0,2,0) and a flat `_selected` style prop
(0,1,0) **cannot beat it**, so SSG would paint a white pill until hydration. Found live: the
`enclosed` `_selected: { shadow: "xs" }` was never overridden by #22, so **a light-mode drop
shadow is leaking onto the selected tab in production right now**.

**Contact** — `ReachOutSection` → `ContactSection`, `id="contact"`. **No form** (confirmed:
three anchors, zero inputs; the mailto pill is the primary action). Drops Twitter and stops
importing `SocialLinksList`.

---

## Seams — what blocks the fan-out

1. **The footer is unclaimed.** Seven design bands, six specs. Its copy changes
   ("This site is built with NextJS…" → "Mobile-first · Titillium Web + Mulish") across 13
   locales and nobody proposed it. It lives in `index.tsx`, so five PRs touch it and none
   redesign it.
2. **`SocialLinksList` mutual-orphan bug.** Hero says it's retired; Contact says Hero keeps
   it alive; Hero's risk note says *Contact* keeps it alive. Each spec's reason for not
   deleting it is a fact the other spec's PR is about to falsify. If both land: zero
   consumers, `waggle` dead, nobody deletes either.
3. **`globalCss` is unowned** and four sections depend on it. It's what invalidates Hero.
4. **`drawrail` keyframe collision.** Hero and Skills define the same name with incompatible
   semantics. Resolution: Hero's layer-2 rail is a verified no-op (layer 1 already paints the
   identical path in the identical colour) — delete it, and Skills' `from`-based fix is safe.
5. **Four sections, four mechanisms for one breakpoint problem** (640 theme bp / 900 raw
   at-rule / 820 container query / 900 hardcoded). Settle once.
6. **`linkRecipe` — the highest-value item, and nobody proposed it.** Five of six sections
   hand-pin `color` on ~20 `<Link>`s to dodge the same trap. One recipe kills it site-wide.
7. **Brand nouns keyed vs unkeyed contradiction.** "GitHub" is unkeyed (Hero) and keyed
   (Contact) in the same PR series. Proposed rule: *if you'd write it identically in ja and
   uk, it's data; if you'd translate it, it's copy.*
8. **Anchor contract:** all five ids are missing today (one `id=` exists in all of `src/`,
   on the wrong element under the wrong name). Adding ids has **zero visual effect** → put
   them in shared, and the "Header first vs last" dilemma dissolves.

---

## Recommended order

0. **`chore/redesign-shared`** — theme (keyframes, breakpoint/condition, `container.page`
   1160px, `letterSpacings.kicker`, a small-end `fontSizes` scale below today's `sm: 1rem`
   floor, radii, `buttonRecipe`/`headingRecipe`, **`linkRecipe`**, `globalCss` incl.
   `scrollPaddingTop`), the MainSection decision, the 5 ids + `#work` retarget of
   `HeroSection.tsx:43` (atomic — split it and Hero's CTA breaks silently in between), fonts
   in `_app.tsx` + `preview.tsx` identically, `data.ts` short label.
1–5. **Hero · About · Skills · Work · Contact** — fully parallel, no constraints left.
6. **Header** — after ≥1 band, so its first baseline is a bar over redesigned content.
7. **`chore/redesign-sweep`** — the only way "whoever lands last sweeps" becomes a real
   assignment: `SocialLinksList`, `waggle`, `CurvedDownArrow`, `version-control.svg`, and
   whichever icons are actually orphaned once Skills **and** Work have landed.

---

## Open corrections to fold in

- **Baseline commit mismatch.** Every spec anchors to build 77 @ `c46544d`; HEAD is
  `ca360ac`. Re-verify before trusting any "expect a diff" claim — a baseline attributed to
  the wrong commit is the same failure class as the Dependabot count.
- **Container queries work** (verified): named + tokens resolve inside the at-rule.
- **v3 registers 34 keyframes**; `drawrail`/`nodepop`/`fadeup` don't collide.
- **Untrusted-data check:** all 7 agents independently reported the design files contain
  nothing resembling instructions; treated as data throughout. Only project
  `3888fdd5-74ed-4b01-9f59-d3c985e1ddde` was opened.
