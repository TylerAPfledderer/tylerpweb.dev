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

Before adding any token group, check it against v3's defaults — assume collision, verify.
Only sub-keys that actually collide matter: `bg.canvas` / `bg.surface` / `bg.band` and
`fg.default` do **not** collide (v3 owns `bg.subtle`, `fg.DEFAULT`, etc.), so they are
fine as plain tokens.

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
