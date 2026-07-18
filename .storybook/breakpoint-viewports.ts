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
// The `base` (0-width) breakpoint has no entry in `.values` and is intentionally
// omitted: it is the implicit below-`sm` default, not a boundary to snapshot at.
// Every entry that IS here carries a `min`, and we snapshot at exactly that
// min-width — the width at which the breakpoint first activates.

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

const entries = system.breakpoints.values.filter(
  (entry): entry is { name: string; min: string; max?: string | null } =>
    typeof entry.min === "string",
);

// { sm: { name, styles, type }, nav: {...}, md, lg, xl, 2xl }
export const breakpointViewports: ViewportMap = Object.fromEntries(
  entries.map((entry) => {
    const width = toPx(entry.min);
    return [
      entry.name,
      {
        name: `${entry.name} (${width}px)`,
        // Height is a nominal tall box for the toolbar preview. Chromatic captures
        // full story height by default (cropToViewport is off), so the width is
        // the load-bearing value; height never crops a section.
        styles: { width: `${width}px`, height: "900px" },
        type: viewportType(width),
      },
    ];
  }),
);

// One Chromatic mode per breakpoint, each referencing a viewport option by key.
// Applied globally in preview.tsx so EVERY story (every section) is snapshotted
// at EVERY breakpoint — the per-viewport-per-section coverage this adds.
// { sm: { viewport: "sm" }, nav: { viewport: "nav" }, ... }
export const breakpointModes = Object.fromEntries(
  entries.map((entry) => [entry.name, { viewport: entry.name }]),
) as Record<string, { viewport: string }>;
