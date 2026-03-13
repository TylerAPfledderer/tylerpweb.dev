# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn lint         # Run ESLint (also runs automatically via Husky pre-commit hook)
yarn theme        # Generate Chakra UI theme tokens from src/lib/theme.ts
yarn theme:watch  # Watch and regenerate theme tokens on change
```

## Architecture

This is a single-page portfolio website built with Next.js 13 (Pages Router), TypeScript, and Chakra UI.

### Page Structure

The entire site is a single page (`src/pages/index.tsx`) composed of sequential section components:
- `HeroSection` → `AboutMeSection` → `SkillsSection` → `ProjectsSection` → `ReachOutSection`

`MainSection` is a layout wrapper used by sections.

### Internationalization

The site supports 13 languages via `next-i18next`. Translation files live in `public/locales/<lang>/` with three namespaces:
- `common` — general UI strings
- `projects-item-data` — project descriptions
- `open-source-data` — open source contribution descriptions

Crowdin is configured (`crowdin.yml`) to sync translations from `public/locales/en/` as the source.

### Theming

Custom Chakra UI theme is defined in `src/lib/theme.ts` and uses semantic color tokens. Run `yarn theme` after modifying this file to regenerate type definitions. The theme defines:
- Semantic color tokens (`primary`, `secondary`, etc.)
- A custom CSS Grid-based spacing scale for typography (`text.sm`, `text.base`, `text.md`, etc.)

### Path Aliases (tsconfig.json)

- `@/components/*` → `src/components/*`
- `@/data` → `src/lib/data.ts`
- `@/svg-icons` → `src/lib/icons/`

### Custom Icons

`src/lib/icons/` contains custom SVG React components for tech stack icons (React, Next.js, Vue, Chakra UI, Tailwind, etc.) not available in `react-icons`. All are exported from `src/lib/icons/index.ts`.
