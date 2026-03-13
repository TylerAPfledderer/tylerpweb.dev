# Modernization Migration Plan: tylerpweb.dev

## Context

This portfolio site (Next.js 13.4.5, Pages Router, Chakra UI v2, next-i18next, Yarn) needs a full modernization pass. The goal is to reach Next.js 15 App Router, Chakra UI v3, pnpm, updated Crowdin, and a Claude-powered UX review workflow — all incrementally, with each step shipping as its own independently deployable PR.

**Critical constraints:**
- `next-i18next` is Pages Router-only — i18n must migrate to `next-intl` at the same time as App Router
- `ProjectsSection` uses `useTab`, `useTabPanel`, `useMultiStyleConfig` — all three are removed in Chakra UI v3 (biggest single-component rewrite in the project)
- Chakra v3 + Pages Router is a valid stable transitional state — doing Chakra first isolates the hardest change before App Router complexity is added

---

> **Note:** First implementation action — copy this plan to `/home/user/tylerpweb.dev/MIGRATION_PLAN.md` for download and reference.

## Migration Order (9 PRs)

### PR 1 — `feat: migrate from yarn to pnpm`

**Risk:** Low — completely independent, no functional changes.

**Changes:**
- `pnpm import` from existing `yarn.lock`, then delete `yarn.lock`
- Create `.npmrc` with `shamefully-hoist=true` as a safety valve for hoisted deps
- Update `package.json` `prepare` script → `postinstall` (pnpm doesn't run `prepare` for root by default; Husky 8 needs this)
- Update `.husky/pre-commit` from `yarn lint` → `pnpm lint`
- Update `CLAUDE.md` commands

**Verify:** `pnpm dev`, `pnpm build`, `pnpm lint` all pass; Husky pre-commit hook triggers correctly.

**Files:** `package.json`, `yarn.lock` (delete), `pnpm-lock.yaml` (new), `.npmrc` (new), `.husky/pre-commit`, `CLAUDE.md`

---

### PR 2 — `refactor: rewrite ProjectsSection tabs using standard Chakra v2 API`

**Risk:** Low — stays entirely within Chakra v2, no dependency changes, no i18n impact. Pure component refactor.

**Why first:** `useTab`, `useTabPanel`, and `useMultiStyleConfig` are removed in Chakra v3. Refactoring them out now on familiar Chakra v2 ground means PR 3 (the Chakra v3 migration) has no low-level hook complexity to untangle.

**`src/components/ProjectsSection/index.tsx`:**
- Replace `CustomTab` (currently built on `useTab()` + `useMultiStyleConfig("Tabs")` + `__css` styling) with a standard Chakra v2 `<Tab>` using the `_selected` style prop and `sx`/inline styles for visual customization
- Replace `CustomPanel` (currently built on `useTabPanel()`) with a standard `<TabPanel>` wrapper
- Remove imports: `useTab`, `useTabPanel`, `useMultiStyleConfig`, `forwardRef`
- All tab ARIA behavior comes from the standard `<Tabs>`, `<Tab>`, `<TabPanel>` components (no custom hook wiring needed)
- Use the Chakra v2 `Tabs` `variant` system or inline `sx` styling to achieve the same visual result
- `isLazy` prop stays on `<Tabs>` unchanged

**Verify:** Tab switching works; selected tab visual state matches current design; keyboard navigation; lazy mounting of inactive panel; `pnpm build` passes; no visual regression on the Projects section.

**Files:** `src/components/ProjectsSection/index.tsx`

---

### PR 3 — `feat: migrate Chakra UI v2 → v3 (theme and provider)`

**Risk:** Medium-High — Pages Router stays, isolating this to theme/provider changes only. Tabs are already clean from PR 2.

**Why Chakra v3 before App Router:** Chakra v3 is the most far-reaching dependency change. Settling it on Pages Router first means App Router migration (PR 7) is a structural transformation only, not a combined refactor.

**Breaking changes to handle:**

| Removed in v3 | Replacement |
|---|---|
| `extendBaseTheme` | `createSystem(defaultConfig, { ... })` |
| `<ChakraProvider theme={theme}>` | `<ChakraProvider value={system}>` |
| `@chakra-ui/next-js` package | Not needed (v3 uses CSS variables, not Emotion) |
| `@emotion/react`, `@emotion/styled` | Remove entirely |
| `calc` utility from `@chakra-ui/react` | Inline CSS template literal: `` `calc(100% + ${size28})` `` |
| `keyframes` from `@chakra-ui/react` | Inline `@keyframes` CSS string or Framer Motion |
| `@chakra-ui/cli` v2 | `@chakra-ui/cli` v3 (different token generation) |
| Component theming via `components.Heading` etc. | Recipes (`defineRecipe`, `defineSlotRecipe`) |

**`src/lib/theme.ts`** — full rewrite:
- `extendBaseTheme` → `createSystem(defaultConfig, { ... })`
- Semantic tokens via `defineSemanticTokens`
- Custom `space.text.*` → `tokens.spacing`
- Custom `fontSizes`/`lineHeights` → `tokens.fontSizes`/`tokens.lineHeights`
- `components.Heading`, `components.Button` → `defineRecipe` entries

**`src/pages/_app.tsx`:**
- Remove `@chakra-ui/next-js` import
- `<ChakraProvider theme={theme}>` → `<ChakraProvider value={system}>`

**`src/components/ProjectsSection/ProjectItemCard.tsx`:**
- `import { Image } from "@chakra-ui/next-js"` → `import Image from "next/image"` (package removed)

**`src/components/AboutMeSection.tsx`:**
- Replace `calc("100%").add(size28).toString()` with `` `calc(100% + ${size28})` ``
- Verify `useToken` still resolves after token restructure
- Verify `Highlight` `styles` prop shape (API changed in v3)

**`src/components/SocialLinksList.tsx`:**
- Replace `keyframes` import with inline CSS `@keyframes` string or Framer Motion

**`src/lib/icons/*.tsx`:**
- `createIcon` still exists in v3 — verify each icon renders

**`package.json` changes:**
- Remove: `@chakra-ui/react@^2`, `@chakra-ui/next-js`, `@emotion/react`, `@emotion/styled`, `@chakra-ui/cli@^2`, `@chakra-ui/styled-system`
- Add: `@chakra-ui/react@^3`, `@chakra-ui/cli@^3`
- Keep: `framer-motion` (still used directly in animations)

**Verify:** Visual regression across all sections (colors, fonts, spacing); `AboutMeSection` skewed background; hover animation on social links; all icons render; `pnpm build` passes TypeScript.

**Files:** `src/lib/theme.ts`, `src/pages/_app.tsx`, `src/components/AboutMeSection.tsx`, `src/components/SocialLinksList.tsx`, `src/components/ProjectsSection/ProjectItemCard.tsx`, `src/lib/icons/*.tsx`, `package.json`

---

**Chakra v3 Tabs:** Now that the component uses standard Chakra v2 `<Tab>`/`<TabPanel>` (from PR 2), the v3 migration upgrades these to Chakra v3's `Tabs.Trigger`/`Tabs.Content` primitives — a simpler API swap rather than a full hook rewrite.
- Add a `defineSlotRecipe` for Tabs in `src/lib/theme.ts` to handle visual styling
- `isLazy` prop → may be `lazyMount` in v3 (verify)

**Verify:** Visual regression across all sections; `AboutMeSection` skewed background; hover animation on social links; all icons render; Tabs still switch correctly; `pnpm build` passes TypeScript.

**Files:** `src/lib/theme.ts`, `src/pages/_app.tsx`, `src/components/AboutMeSection.tsx`, `src/components/SocialLinksList.tsx`, `src/components/ProjectsSection/ProjectItemCard.tsx`, `src/components/ProjectsSection/index.tsx` (Tabs.Trigger/Content upgrade), `src/lib/icons/*.tsx`, `package.json`

---

### PR 4 — `feat: replace next-i18next with next-intl (Pages Router)`

**Risk:** Medium — touches 7 component files but changes are mechanical. Pages Router stays.

**`package.json`:**
- Remove: `next-i18next`, `react-i18next`, `i18next`
- Add: `next-intl@^3`

**New `src/i18n/routing.ts`:**
```ts
import { defineRouting } from "next-intl/routing";
export const routing = defineRouting({
  locales: ["da","de","en","es","fi","fr","it","ja","nl","pl","pt","sv","uk"],
  defaultLocale: "en"
});
```

**`next.config.js`:**
- Remove `i18n` import from `next-i18next.config.js`
- Keep `i18n` block (required for Pages Router locale routing), but populate directly from locale list
- Delete `next-i18next.config.js`

**`src/pages/_app.tsx`:**
- Remove `appWithTranslation` from next-i18next
- Add `NextIntlClientProvider` from `next-intl` wrapping the app
- Provider receives `messages` from `pageProps`

**`src/pages/index.tsx`:**
- Replace `serverSideTranslations` with `getMessages` from `next-intl/server` in `getStaticProps`
- `Trans` import: `next-i18next` → `next-intl`

**All 7 components using `useTranslation`** (`HeroSection`, `AboutMeSection`, `SkillsSection`, `ProjectsSection/index`, `ProjectItemCard`, `OpenSourceItemCard`, `ReachOutSection`):
- `import { useTranslation } from "next-i18next"` → `import { useTranslations } from "next-intl"`
- `const { t } = useTranslation("ns")` → `const t = useTranslations("ns")`

**`src/components/ProjectsSection/utils.ts`:**
- Replace `ParseKeys<"namespace">` from i18next types with next-intl's `Messages` type utilities

**Translation files:** No changes needed — next-intl can load the existing `public/locales/[locale]/*.json` files. Configure `getMessages` to merge the 3 namespace files per locale.

**Delete:** `next-i18next.config.js`, root `i18n.ts` (the react-i18next test harness)

**Verify:** All 13 locales load; `Trans` with components renders (footer copyright, about description); `projects-tab-open-source` with `hideBelow` span renders; TypeScript `ParseKeys` replacement types resolve; `pnpm build` generates all 13 static pages.

**Files:** `src/pages/_app.tsx`, `src/pages/index.tsx`, all 7 section components, `src/components/ProjectsSection/utils.ts`, `src/i18n/routing.ts` (new), `next.config.js`, `package.json`

---

### PR 5 — `feat: upgrade Next.js 13 → 15 (Pages Router)`

**Risk:** Low-Medium — static site with `getStaticProps` is largely unaffected by Next.js 14/15 breaking changes.

**`package.json`:**
- `next: 13.4.5` → `next: ^15.x`
- `eslint-config-next` → same version as next
- React: keep at `^18.x` (Next.js 15 supports both 18 and 19; conservative upgrade)
- Run `pnpm next lint` — `eslint-config-next` will flag any deprecated patterns

**Key Next.js 14/15 breaking changes (most don't apply to this codebase):**
- `fetch` caching defaults changed (not relevant — no `fetch` in static props)
- `<Link>` legacy behavior (verify no `<a>` children)
- No `getServerSideProps`, no API routes, no middleware (doesn't apply)
- Pages Router with `i18n` still fully supported in Next.js 15

**Verify:** `pnpm dev`; `pnpm build`; all 13 locales generate; site renders identically; no new TypeScript errors from updated `next` types.

**Files:** `package.json`, `pnpm-lock.yaml`

---

### PR 6 — `feat: scaffold App Router (coexist with Pages Router)`

**Risk:** Medium — Pages Router and App Router coexist in Next.js 15; this PR is additive only.

**New structure:**
```
src/app/
  layout.tsx           ← HTML shell + fonts
  [locale]/
    layout.tsx         ← locale layout with providers + translations
    page.tsx           ← stub (placeholder for PR 7)
src/middleware.ts      ← next-intl locale routing
src/app/providers.tsx  ← "use client" — ChakraProvider + NextIntlClientProvider
src/i18n/request.ts   ← next-intl getRequestConfig (App Router)
```

**`src/app/layout.tsx`:** HTML shell; fonts via `next/font/google` with `variable` option (replaces `_app.tsx` CSS var injection)

**`src/app/providers.tsx`** (`"use client"`): Chakra v3 `<ChakraProvider value={system}>` + `NextIntlClientProvider`

**`src/app/[locale]/layout.tsx`:** Sets `<html lang={locale}>`; loads messages via `getMessages()`; wraps children in `Providers`

**`src/app/[locale]/page.tsx`:** Stub returning placeholder — confirms the route works before full migration

**`src/middleware.ts`:** `createMiddleware` from `next-intl/server` with locale routing config. Use a matcher that excludes Pages Router routes, `/_next/`, `/api/`, and static files so both routers coexist cleanly.

**`next.config.js`:** Keep `i18n` block (still needed for Pages Router pages in this PR)

**Verify:** Navigating to `/en` returns the App Router stub; root `/` still serves Pages Router content; Chakra v3 provider works in App Router shell; `pnpm build` succeeds with both routers.

**Files:** `src/app/layout.tsx` (new), `src/app/providers.tsx` (new), `src/app/[locale]/layout.tsx` (new), `src/app/[locale]/page.tsx` (new stub), `src/middleware.ts` (new), `src/i18n/request.ts` (new)

---

### PR 7 — `feat: complete App Router migration, remove Pages Router`

**Risk:** High — largest PR, but the hardest individual changes (Chakra v3, i18n) are already done.

**Add `"use client"` to all interactive components** (all use Chakra hooks or `useTranslations`):
- `HeroSection`, `AboutMeSection`, `SkillsSection`, `ReachOutSection`, `SocialLinksList`, `MainSection`
- `ProjectsSection/index.tsx`, `ProjectItemCard.tsx`, `OpenSourceItemCard.tsx`

**`src/app/[locale]/page.tsx`:** Replace stub with full content from `src/pages/index.tsx`. Remove `getStaticProps` (translations loaded in layout). Add `generateStaticParams` returning all 13 locales.

**SEO — replace `next-seo` with native Next.js metadata API:**
- Remove `next-seo` dependency and `DefaultSeo` from providers
- Add `generateMetadata` (or static `metadata` export) to `src/app/[locale]/layout.tsx` replicating `next-seo.config.ts` values (title, description, OG, Twitter card)
- Delete `next-seo.config.ts`

**`_document.tsx` favicon/manifest:** Migrate to `metadata.icons` and `metadata.manifest` in the layout

**`next.config.js`:** Remove `i18n` block (incompatible with App Router); add `withNextIntl` wrapper

**URL structure change:** next-intl default `localePrefix: "always"` → root `/` redirects to `/en`. If you want `/` to serve English without the prefix use `localePrefix: "as-needed"` in `routing.ts`.

**Delete:**
- `src/pages/_app.tsx`, `src/pages/_document.tsx`, `src/pages/index.tsx`

**Verify:** Full visual inspection at `/en`; all 13 locales; `Trans` with components; footer year interpolation; Tabs interaction; `generateStaticParams` emits 13 routes in build; SEO `<head>` tags correct; favicon loads; root `/` redirects correctly; Lighthouse accessibility score maintained.

**Files:** All `src/components/*.tsx` (add `"use client"`), `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`, `next.config.js`, `package.json` (remove `next-seo`), delete `src/pages/`, delete `next-seo.config.ts`

---

### PR 8 — `feat: update Crowdin config + add Claude UX/design review tooling`

**Risk:** Low — additive config and tooling only.

**Crowdin:**
- Verify `crowdin.yml` against latest Crowdin CLI v4/v5 YAML schema for deprecated keys
- Update if needed (source/translation paths remain `public/locales/en/*.json` and `public/locales/%two_letters_code%/...`)
- Add Crowdin CLI to `devDependencies` if not already present
- Add `pnpm crowdin` script to `package.json`

**Claude UX/design MCP stack — add to `.claude/settings.json`:**

Three complementary MCPs covering different aspects of UX and design quality:

1. **Playwright MCP** (`@playwright/mcp`) — live browser access: navigate the running app, test interactions, responsive layouts, keyboard nav
2. **WCAG Color Contrast MCP** (`mcp-wcag-color-contrast` by bryanberger) — runs actual WCAG contrast equations against the Chakra semantic color tokens (LLMs often give inaccurate contrast scores without this); validates primary teal `#297B91`, secondary gold `#FFB700`, background `#182326`
3. **Page Design Guide MCP** (`page-design-guide-mcp` by chihebnabil) — design best practices knowledge base (color psychology, typography, layout patterns, spacing); useful for theme improvement guidance without needing Figma

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "wcag-contrast": {
      "command": "npx",
      "args": ["-y", "mcp-wcag-color-contrast"]
    },
    "design-guide": {
      "command": "npx",
      "args": ["-y", "page-design-guide-mcp"]
    }
  }
}
```

**Optional — if you have a Figma file:**
- Add Figma MCP (`mcp add --transport http figma https://mcp.figma.com/mcp`) to extract design tokens and color variables directly into the Chakra v3 `createSystem` config

**`CLAUDE.md` additions:**
- UX Review section: how to use Playwright MCP to test a section (start dev server, then ask Claude to navigate and review)
- Color Review section: how to use WCAG Contrast MCP to validate all semantic color token pairs

**Cleanup:**
- Remove `yarn theme` / `yarn theme:watch` references from `CLAUDE.md` (Chakra v3 types generated via `createSystem` TypeScript inference)
- Update all `yarn` → `pnpm` references in `CLAUDE.md`
- Final `pnpm audit` for security vulnerabilities

**Verify:** Claude Code connects to all three MCP servers; Playwright can navigate `localhost:3000`; WCAG MCP can check `#297B91` on `#182326` and return a contrast ratio; `pnpm dev/build/lint` all pass.

**Files:** `crowdin.yml`, `.claude/settings.json` (new), `CLAUDE.md`, `package.json`

---

## Summary Table

| PR | Change | Chakra | Next.js | i18n | Router | Risk |
|---|---|---|---|---|---|---|
| 1 | yarn → pnpm | v2 | 13 | next-i18next | Pages | Low |
| 2 | Refactor tabs off custom hooks | v2 | 13 | next-i18next | Pages | Low |
| 3 | Chakra v3 migration | v3 | 13 | next-i18next | Pages | Med-High |
| 4 | next-i18next → next-intl | v3 | 13 | next-intl | Pages | Medium |
| 5 | Next.js 13 → 15 | v3 | 15 | next-intl | Pages | Low-Med |
| 6 | App Router scaffold | v3 | 15 | next-intl | Both | Medium |
| 7 | Full App Router migration | v3 | 15 | next-intl | App | High |
| 8 | Crowdin + Playwright MCP | v3 | 15 | next-intl | App | Low |

---

## Critical Files Reference

| File | Changed in PR(s) | Notes |
|---|---|---|
| `src/lib/theme.ts` | 2, 3 | Full rewrite: `extendBaseTheme` → `createSystem`; add Tabs slot recipe |
| `src/pages/_app.tsx` | 2, 4 | Provider swap (Chakra v3); i18n provider swap |
| `src/components/ProjectsSection/index.tsx` | 2, 3, 4, 7 | Tabs refactor off hooks (PR 2); Chakra v3 upgrade (PR 3); `useTranslation` swap (PR 4); `"use client"` (PR 7) |
| `src/components/AboutMeSection.tsx` | 2, 7 | `calc` fix, `keyframes` fix, `Highlight` API; `"use client"` |
| `src/pages/index.tsx` | 4, 7 | i18n swap (PR 4); deleted (PR 7) |
| `next.config.js` | 4, 5, 7 | Remove next-i18next; Next.js 15; remove `i18n` block + add `withNextIntl` |
| `src/components/ProjectsSection/utils.ts` | 4 | `ParseKeys` → next-intl `Messages` types |
| `crowdin.yml` | 8 | Schema verification/update |

## Key Risk Mitigations

| Risk | PR | Fix |
|---|---|---|
| `calc` import removed (Chakra v3) | 2 | Replace with `` `calc(100% + ${size28})` `` |
| `keyframes` import removed (Chakra v3) | 2 | Inline CSS animation string or Framer Motion |
| `useTab`/`useTabPanel`/`useMultiStyleConfig` removed in v3 | 2, 3 | PR 2: refactor to standard Chakra v2 `<Tab>`/`<TabPanel>`; PR 3: upgrade to v3 primitives |
| `@chakra-ui/next-js` `Image` import removed | 2 | → `import Image from "next/image"` |
| pnpm phantom deps | 1 | `.npmrc` `shamefully-hoist=true` as safety valve |
| `ParseKeys` from i18next removed | 4 | next-intl `Messages` type |
| URL structure `/` → `/en` change | 7 | Configure `localePrefix` in next-intl routing |
| All components need `"use client"` | 7 | Systematic audit; TypeScript will catch misses |
