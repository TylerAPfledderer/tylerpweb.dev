import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { SkillsSection } from "./SkillsSection";

const meta = {
  component: SkillsSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof SkillsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Guards the anchor contract — see HeroSection.stories.tsx for why this is the
// only thing checking it.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("#skills"),
      "SkillsSection must keep id='skills' — the header nav targets #skills.",
    ).not.toBeNull();
  },
};

// Guards the 11-skill data contract. Both the desktop rail (SVG) and the mobile
// chip grid render into the DOM at once — the container query that hides one is
// NOT evaluated under vitest/jsdom — so every skill label and sha appears TWICE.
// Assert on the doubled count so the play function is deterministic; a dropped or
// reordered skill fails this gate rather than only Chromatic.
export const SkillsData: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const labels = ["HTML5", "CSS3", "JavaScript", "NextJS"] as const;
    for (const label of labels) {
      await expect(
        canvas.getAllByText(label).length,
        `${label} must render in both the rail and the chip grid.`,
      ).toBe(2);
    }
    // 11 skills → 11 shas, each in both surfaces → 22 total. #01 and #11 are the
    // endpoints; assert both to catch a truncated/extended list.
    await expect(canvas.getAllByText("#01").length).toBe(2);
    await expect(canvas.getAllByText("#11").length).toBe(2);
  },
};

// CssCheck: proves the Chakra theme loaded in the shared preview. SkillsSection
// renders a <section> with bg="bg.canvas" (#0b1617 -> rgb(11, 22, 23)); an
// unstyled render would not match. The expected value is hardcoded ON PURPOSE —
// deriving it from the theme would make the assertion tautological. NOTE axe
// cannot measure the rail label/sha contrast (they sit over an SVG, an
// undeterminable backdrop) — a green a11y run is absence-of-measurement there,
// so those ratios are hand-verified against the canvas, not trusted from the gate.
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("section");
    await expect(section).not.toBeNull();
    await expect(
      getComputedStyle(section!).backgroundColor,
      "Expected SkillsSection's bg to resolve to the theme's bg.canvas. If you changed bg.canvas in src/lib/theme.ts, update this value; otherwise the ChakraProvider/theme likely isn't loading in .storybook/preview.tsx.",
    ).toBe("rgb(11, 22, 23)");
  },
};
