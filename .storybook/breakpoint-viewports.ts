import type { ViewportMap } from "storybook/viewport";

import { system } from "../src/lib/theme";

// Storybook viewports + Chromatic viewport modes, DERIVED from the Chakra
// breakpoints rather than hand-copied. "Equal to the breakpoints" is then a
// structural guarantee, not a thing to keep in sync: add or move a breakpoint in
// src/lib/theme.ts and both the toolbar list and Chromatic's per-viewport
// snapshots follow automatically. A hardcoded pixel list would silently drift the
// first time the scale changed — the same dead-token failure class this repo
// keeps getting bitten by (a value that typechecks clean and is quietly wrong).
//
// `system.breakpoints.values` is the MERGED, sorted set (Chakra's defaultConfig
// sm/md/lg/xl/2xl + this theme's custom `nav`), so it is the real answer to "what
// are the breakpoints", not just the one override theme.ts declares. It is public
// typed API (BreakpointEntry[] = { name, min?, max? }), not an internal.
//
// Every entry that comes from `.values` carries a `min`, and we snapshot at
// exactly that min-width — the width at which the breakpoint first activates.

// Chakra's `base` breakpoint is the implicit below-`sm` default and has NO entry
// in `.values` (its min-width is 0). Pin it to a concrete 375px — the canonical
// modern-phone width (iPhone SE 2 / 8 / X-class) — so the true mobile layout gets
// its own snapshot, which the 480px `sm` capture never reaches. Prepended to the
// derived set; the sort below keeps it first since 375 < 480.
const EXTRA_VIEWPORTS: { name: string; width: number }[] = [
  { name: "base", width: 375 },
];

// A common real-world height for each viewport WIDTH — the height a device (or, at
// desktop widths, the most common browser viewport) of that width actually has.
// Height does NOT affect Chromatic captures: full story height is snapshotted
// (cropToViewport is off), so this only sets the toolbar preview's aspect ratio.
// Any width not listed (e.g. a future breakpoint) falls back to a 16:10 ratio.
const COMMON_HEIGHT_BY_WIDTH: Record<number, number> = {
  375: 667, //   iPhone SE (2nd gen) / 8 — canonical phone
  480: 800, //   WVGA — common small Android
  640: 960, //   DVGA
  768: 1024, //  iPad, portrait
  1024: 768, //  iPad, landscape (XGA)
  1280: 800, //  WXGA laptop
  1536: 864, //  the most common desktop viewport (scaled 1080p laptop)
};

function heightFor(width: number): number {
  return COMMON_HEIGHT_BY_WIDTH[width] ?? Math.round((width * 10) / 16);
}

// Chakra breakpoint minimums are rem (e.g. "30rem"); Chromatic modes accept only
// whole numbers or "px"-suffixed strings. Convert to integer px. rem/em are ×16
// (the browser root default; the site never overrides the root font-size), px
// passes through. Anything else throws rather than emitting a silently wrong box.
function toPx(min: string): number {
  const value = parseFloat(min);
  if (Number.isNaN(value)) {
    throw new Error(`Unparseable breakpoint minimum: "${min}"`);
  }
  if (min.endsWith("rem") || min.endsWith("em")) return Math.round(value * 16);
  if (min.endsWith("px")) return Math.round(value);
  throw new Error(`Unsupported breakpoint unit in "${min}" — expected rem/em/px`);
}

// Toolbar-icon hint only (which glyph the viewport dropdown shows). Has no effect
// on the captured pixels; purely cosmetic grouping in the Storybook UI.
function viewportType(px: number): "mobile" | "tablet" | "desktop" {
  if (px < 768) return "mobile";
  if (px < 1024) return "tablet";
  return "desktop";
}

// base (375) + the six named breakpoints, ascending by width.
const viewports = [
  ...EXTRA_VIEWPORTS,
  ...system.breakpoints.values
    .filter(
      (entry): entry is { name: string; min: string; max?: string | null } =>
        typeof entry.min === "string",
    )
    .map((entry) => ({ name: entry.name, width: toPx(entry.min) })),
].sort((a, b) => a.width - b.width);

// { base: {...}, sm: {...}, nav, md, lg, xl, 2xl }
export const breakpointViewports: ViewportMap = Object.fromEntries(
  viewports.map(({ name, width }) => [
    name,
    {
      name: `${name} (${width}px)`,
      styles: { width: `${width}px`, height: `${heightFor(width)}px` },
      type: viewportType(width),
    },
  ]),
);

// One Chromatic mode per viewport. Applied globally in preview.tsx so EVERY
// story (every section) is snapshotted at EVERY viewport — the
// per-viewport-per-section coverage this adds.
//
// Each mode carries EXPLICIT dimensions, not a `{ viewport: name }` string
// reference. Chromatic documents both forms, and the string form is what this
// file emitted originally — but the per-story `modes` overrides in
// Header.stories.tsx did not take effect with it (Tyler observed the snapshots
// coming back at the wrong widths). The string form requires Chromatic to
// resolve the name against Storybook's viewport options at capture time;
// width/height leaves nothing to resolve, so it cannot fail that way.
//
// NOTE: the resolution failure is the *suspected* cause, inferred from the fix
// working — it was never isolated directly. If per-story modes misbehave again,
// re-check this assumption rather than trusting it.
//
// { base: { viewport: { width: 375, height: 667 } }, sm: {...}, ... }
export const breakpointModes = Object.fromEntries(
  viewports.map(({ name, width }) => [
    name,
    { viewport: { width, height: heightFor(width) } },
  ]),
) as Record<string, { viewport: { width: number; height: number } }>;
