---
paths:
  - "src/lib/theme.ts"
  - "src/components/**"
  - "src/lib/icons/**"
  - ".storybook/**"
---

# Chakra UI v3

This project migrated v2 → v3 in PR #19. The v2 APIs are gone; do not reintroduce them.

## API

- `createSystem(defaultConfig, config)` — never `extendTheme` / `extendBaseTheme`.
- `<ChakraProvider value={system}>` — `value=`, not `theme=`. Provider lives at
  `src/components/ui/provider.tsx` and is shared by `_app.tsx` and the Storybook preview.
- `gap`, never `spacing`, on Stack/VStack/HStack.
- Run `bun run theme` (`chakra typegen`) after editing `src/lib/theme.ts`.
- Keyframes are referenced by name via `animationName`; v3 dropped the `keyframes` export.

## `as={X}` → `asChild` + `<X>` as the singleton child

```tsx
// WRONG — typechecks clean, renders a <div>, silently destroys ul/li semantics
<VStack {...listStyleProps}>

// RIGHT
<VStack asChild><List.Root>…</List.Root></VStack>
```

Never flatten an `as={X}` into style props. It compiles, it looks right, and it throws
away the `ul` / `li` / `a` semantics the a11y tree depends on.

### Prefer `as="<html-element>"` over `chakra.<element>` for plain HTML elements

For a bare HTML element with no custom component behind it, reach for a layout
primitive with an `as` string — `<Flex as="section">`, `<Box as="nav">` — not
`chakra.section` / `chakra.nav`. Reserve `as` for **HTML element strings**; for a
**component** that forwards props, use `asChild` with the component as the singleton
child (the section above). This keeps one consistent idiom across the codebase and makes
the intent (layout box vs. semantic element vs. composed component) legible at the call
site.

- `as="section"` (string) → renders a real `<section>`; the element/anchor semantics and
  `querySelector("section")`-style story guards are preserved. This is the sanctioned form.
- `as={SomeComponent}` → **avoid**; use `asChild` + `<SomeComponent>` instead, so the
  component's own props/behavior compose in rather than being flattened away.

The Chakra MCP confirms the prop shapes (`as: React.ElementType`, `asChild: boolean —
"combining their props and behavior"`) but does NOT encode this reach-for guidance —
`as`'s type permits components too. This preference is a project convention, enforced
here, not by the library. `chakra.<element>` is not wrong, but it is not the house style.

## Typecheck CANNOT catch a dead token

Every token-taking prop (`bg`, `color`, `maxW`, `gap`, …) also accepts an arbitrary
string. A dead token compiles clean, emits raw text as a CSS value, and the browser
**silently discards it**. In PR #19 all four gates were green while 16 real visual
regressions sat in the diff.

**Green CI is not evidence of visual correctness.** Chromatic is the only gate that sees
this class of failure.

Prove a token resolves before trusting it:

```ts
system.token("colors.x.y")   // → a real value, not undefined
system.css({ bg: "x.y" })    // → var(--chakra-*), NOT raw passthrough
```

**Three probe traps, each of which cost real time in PR2 (#22):**

1. **`system.token()` lies about semanticTokens.** It returns a literal for a plain token
   but a `var(--…)` **ref** for a semanticToken — there is no single flat value to return.
   Comparing both against a hex reports a **false FAIL on a correctly fixed token**. The
   trustworthy signal is the condition count:
   ```ts
   system.tokens.cssVarMap  // Map<condition, Map<cssVar, value>>
   // 1 condition = clean · >1 = a v3 default is contending
   ```
2. **`getTokenCss()` is not proof.** It is a config-time object. `conditions:{light:"&",
   dark:"&"}` looked correct there and was fatal in the browser. **Confirm computed styles
   on the real rendered widget** (Playwright is already a dep) before believing any fix.
3. **A transparent backdrop fakes a passing contrast ratio.** `rgba(0,0,0,0)` parses to
   black, which scores brilliantly against light text. Walk ancestors for the first opaque
   background — an idle tab's own `background-color` is transparent; its real backdrop is
   the list behind it.

## Colors: `tokens` vs `semanticTokens` — the rule INVERTS on collision

Both halves of this are load-bearing. Getting either wrong produces a dead token.

**Default: plain `tokens`.** In `semanticTokens`, `base` is the *default-condition* key,
so `primary: { base, dark }` registers `colors.primary` and **never** `primary.base` —
every `.base` call site then emits raw, invalid CSS. This app has no color mode, so
plain `tokens` is also the honest choice. Applies to project-owned names: `primary`,
`secondary`, `background`, `body`, `accent`, `warm`.

**Exception — names v3's `defaultConfig` already owns as semanticTokens MUST go in
`semanticTokens`.** These are `fg.*`, `bg.*`, `border.*` (v3 ships
`fg.muted`, `fg.subtle`, `border.subtle`, `bg.subtle`, `bg.muted`, `bg.panel`, …).

Verified empirically against `@chakra-ui/react@3.36.0` — a plain token loses on
**specificity**, not source order:

```
tokens.colors.fg.muted = "#a9bab9"  emits THREE declarations:
  &:where(html, .chakra-theme)   --chakra-colors-fg-muted: #a9bab9              ← ours, specificity 0
  :root &, .light &              --chakra-colors-fg-muted: var(--…-gray-600)    ← v3 default, WINS
  .dark &                        --chakra-colors-fg-muted: var(--…-gray-400)

semanticTokens.colors.fg.muted = "#a9bab9"  emits ONE:
  &:where(html, .chakra-theme)   --chakra-colors-fg-muted: #a9bab9              ← clean
```

`:where()` has **zero specificity**; `:root` is (0,1,0) and matches every document
unconditionally. So v3's light-mode gray wins **even though this app has no color mode
and never renders a `.light` class**. The design colour is dead and typechecks clean.

### The corollary: every v3 default renders its LIGHT branch on this dark site

The same `:root` mechanism has a second consequence, found in PR2 (#22). v3 ships **112**
default tokens with a `_light`/`_dark` pair (`bg.*`, `fg.*`, `border.*`, every
`<color>.solid/subtle/muted/…`, and the shadows). They emit as:

```
:root &, .light &     ← light values, specificity (0,1,0), :root matches ALWAYS
.dark &, …            ← dark values, same specificity, needs a .dark ancestor
```

This app has no color mode, so **nothing ever sets `.dark`** — the light branch wins every
time. **Every v3 widget we don't explicitly style is a LIGHT widget on a dark site.**

It first bit on the Projects tabs: v3's `enclosed` recipe put the tab list on `bg.muted`
(= `gray-100`), and once the redesign gave `fg.muted` its dark-canvas value the idle label
rendered at **1.84:1** — a WCAG failure that typechecked clean and that Chromatic could
only report as "1 visual change" behind a green check (`exitZeroOnChanges: true`).

**Fix pattern: pin the component to design tokens so it inherits no v3 surface.** Do not
reach for a color-mode switch:

- `class="dark"` on `<html>` **works** (measured 8.78:1) but declares a color mode this
  site does not have. **Rejected by Tyler:** with no dark mode, `.dark`/`.light` should not
  be targetable classes at all.
- `conditions: { light: "&", dark: "&" }` removes the classes but **kills all 112 tokens** —
  `&` alone does not match at the token root. Verified in a browser: `bg.muted` computes to
  empty. The `getTokenCss()` object dump looked correct; only computed styles caught it.

**The other 111 are still armed.** Any component leaning on a v3 default surface hits this
again.

Before adding any token group, check it against v3's defaults — assume collision, verify.
Only sub-keys that actually collide matter: `bg.canvas` / `bg.surface` / `bg.band` and
`fg.default` do **not** collide (v3 owns `bg.subtle`, `fg.DEFAULT`, etc.), so they are
fine as plain tokens.

### `DEFAULT` (uppercase) is the BARE-name key — `default` mints a dead sibling

v3's convention for "the value you get from the bare token name" is the uppercase key
**`DEFAULT`**. `#22` wrote it lowercase:

```ts
fg: { default: "…" }   // WRONG — mints colors.fg.default, referenced NOWHERE in src/
fg: { DEFAULT: "…" }   // RIGHT — registers the bare `colors.fg`
```

Lowercase `default` is treated as an ordinary sub-key: it creates a real-but-dead
`fg.default` token AND leaves the bare `fg` sitting on v3's default `_light` value — a
**black** `<html>` fg, masked on this site only by body's white. Same trap for `bg`.
Unlike `base` in semanticTokens (which *collapses* onto its parent), `DEFAULT` does not
collapse a lowercase sibling — the two coexist and the dead one typechecks clean. Fixed in
PR2: both `fg` and `bg` now resolve at **1 condition**.

### The "1 condition = clean" heuristic has a second exception: plain `radii` overrides

The condition-count probe (`>1 = a v3 default contends`) assumes the failure mode is a
specificity contest. It is not the only one. A plain-token override of `radii.l1/l2/l3`
reports **1 condition and is still dead** — the value never enters the registry at all, so
the emitted var stays `var(--chakra-radii-sm)`. Different failure class from the colors
case: nothing to out-specify, the token simply isn't registered. **Use `semanticTokens`
for radii overrides**, and confirm the computed `border-radius` on a real widget — 1
condition does not clear it here.

## v3 merges default recipes that v2 never had

v2's `extendBaseTheme` **emptied** `components`, so our recipes were the only component
styles. `createSystem(defaultConfig, …)` **merges Chakra's defaults**, which supply values
v2 never had — all invisible to the compiler. Seen in PR #19:

- outline Button inheriting `colorPalette.fg` (near-black on the dark surface)
- `size.lg`'s `textStyle:"md"` clobbering `fontSize`
- Heading `4xl`'s textStyle overriding `letterSpacing`
- Link's base `gap: 1.5`; a 1px transparent border on Button
- `borderRadius` `l2` (4px) vs v2's 6px

Neutralise with `textStyle: "none"` and explicit overrides. `sizes.container.*` was
re-added by hand — v3 dropped the scale, silently unbounding `maxW="container.*"`.

## Fonts must be declared at `:root`

Font families are CSS vars (`--font-tw`, `--font-mulish`, `--font-mono`) referenced from
`theme.tokens.fonts`, self-hosted via `@fontsource/*`. **Never** `next/font/google` — it
fetches at build time and intermittently ETIMEDOUTs on Vercel (fixed in #18).

Declare the vars at `:root` in **both** `src/pages/_app.tsx` and `.storybook/fonts.css`.
`--chakra-fonts-heading: var(--font-tw)` is substituted at computed-value time **on the
element where it is declared**, so a decorator-level wrapper cannot satisfy it: the token
computes to invalid, the empty value inherits down, and every font renders undefined —
typechecking clean the whole way. `.storybook/preview.tsx` must keep its `@fontsource`
and `./fonts.css` imports; drop them and Chromatic baselines the wrong typeface.
