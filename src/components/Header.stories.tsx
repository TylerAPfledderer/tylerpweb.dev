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
// breakpoint, so each story has a subject on only one side of it. preview.tsx
// applies all 7 breakpoints as project-level chromatic.modes; each story here
// switches OFF the half where it renders nothing.
//
// Chromatic STACKS modes — a per-story `modes` object is COMBINED with the
// project-level set, never substituted for it. Listing only the modes you want
// therefore does nothing: build 113 captured Default at all 7 widths, and ran
// MobileMenuOpen's play function at the 5 desktop widths where the hamburger is
// display:none, so getByRole threw and the interaction test failed. The only way
// to drop an inherited mode is `{ disable: true }`, which is what this builds.
//
// Derived from breakpointModes (which comes from system.breakpoints) and sliced
// at `nav` by POSITION, not by a hand-listed set of names — move or rename a
// breakpoint in theme.ts and both halves follow. A literal list would silently
// keep snapshotting a width that no longer exists.
const modeNames = Object.keys(breakpointModes);
const navIndex = modeNames.indexOf("nav");

/** Turns a list of mode names into the `{ name: { disable: true } }` opt-outs. */
const disableModes = (names: string[]) =>
  Object.fromEntries(names.map((name) => [name, { disable: true }]));

/** Switches OFF everything below `nav` — leaves the desktop link row + pill. */
const DISABLE_MOBILE = disableModes(modeNames.slice(0, navIndex));
/** Switches OFF `nav` and up — leaves the hamburger and its dropdown panel. */
const DISABLE_DESKTOP = disableModes(modeNames.slice(navIndex));

// Guards the anchor contract from the referrer side: HeroSection/AboutMeSection/
// SkillsSection/ProjectsSection each guard their own id, but nothing previously
// checked that Header actually links to all five. A typo here would break
// navigation silently — no error, no failed typecheck, no build failure.
//
// Chromatic: mobile widths switched off. Below `nav` this collapses to the
// hamburger, which is MobileMenuOpen's subject — snapshotting it here too would
// just re-diff the same closed hamburger every build.
export const Default: Story = {
  parameters: { chromatic: { modes: DISABLE_MOBILE } },
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
  // Chromatic: desktop widths switched off. The panel is hideFrom="nav", so a
  // wider capture would bank a baseline of an "open" menu that renders as
  // nothing — and worse, the play function below would run there too and throw,
  // since getByRole cannot see a display:none toggle. That is exactly what
  // failed on build 113.
  parameters: { chromatic: { modes: DISABLE_DESKTOP } },
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
