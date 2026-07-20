import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { breakpointModes } from "../../.storybook/breakpoint-viewports";
import { Header } from "./Header";

const meta = {
  component: Header,
  tags: ["ai-generated"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// Header is the one component that swaps its ENTIRE nav on the `nav` (640px)
// breakpoint, so each story has a subject on only one side of it. The
// project-level chromatic.modes captures all 7 breakpoints for every story;
// these two subsets split that matrix at `nav` so no snapshot lands on a width
// where its story renders nothing.
//
// Derived from breakpointModes (which comes from system.breakpoints) and sliced
// at `nav` by POSITION, not by a hand-listed set of names — move or rename a
// breakpoint in theme.ts and both halves follow. A literal list would silently
// keep snapshotting a width that no longer exists.
const modeNames = Object.keys(breakpointModes);
const navIndex = modeNames.indexOf("nav");

const pickModes = (names: string[]) =>
  Object.fromEntries(names.map((name) => [name, breakpointModes[name]]));

/** Widths at/above `nav` — the desktop link row + contact pill. */
const DESKTOP_MODES = pickModes(modeNames.slice(navIndex));
/** Widths below `nav` — the hamburger and its dropdown panel. */
const MOBILE_MODES = pickModes(modeNames.slice(0, navIndex));

// Guards the anchor contract from the referrer side: HeroSection/AboutMeSection/
// SkillsSection/ProjectsSection each guard their own id, but nothing previously
// checked that Header actually links to all five. A typo here would break
// navigation silently — no error, no failed typecheck, no build failure.
//
// Chromatic: DESKTOP_MODES only. Below `nav` this collapses to the hamburger,
// which is MobileMenuOpen's subject — snapshotting it here too would just
// re-diff the same closed hamburger every build.
export const Default: Story = {
  parameters: { chromatic: { modes: DESKTOP_MODES } },
  play: async ({ canvasElement }) => {
    const ids = ["#top", "#about", "#skills", "#work", "#contact"];
    for (const id of ids) {
      await expect(
        canvasElement.querySelector(`a[href="${id}"]`),
        `Header must keep a link to ${id}.`,
      ).not.toBeNull();
    }
  },
};

// Opens the mobile hamburger and STOPS there — deliberately, so Chromatic's
// snapshot captures the panel actually open. A play function that also closed
// the panel before finishing would leave Chromatic snapshotting the closed end
// state, and the panel (conditionally mounted, not hidden) would never get a
// visual baseline at all.
//
// Forced to the "base" (375px) viewport via globals.viewport — the hamburger
// only exists in the accessibility tree below the `nav` breakpoint
// (hideFrom="nav"); the desktop nav links are hideBelow="nav" instead, so at
// Storybook's default responsive width BOTH are in the real DOM but the toggle
// is display:none and unclickable.
export const MobileMenuOpen: Story = {
  globals: { viewport: { value: "base" } },
  // Chromatic: MOBILE_MODES only. The panel is hideFrom="nav", so any wider
  // snapshot would bank a baseline of an "open" menu that renders as nothing.
  parameters: { chromatic: { modes: MOBILE_MODES } },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("button", { name: "Toggle menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    const panel = document.getElementById("header-mobile-panel");
    await expect(panel).not.toBeNull();
    for (const name of ["About", "Skills", "Work", "Contact"]) {
      await expect(
        within(panel!).getByRole("link", { name }),
      ).toBeInTheDocument();
    }
  },
};
