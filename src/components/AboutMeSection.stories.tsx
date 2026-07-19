import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { AboutMeSection } from "./AboutMeSection";

const meta = {
  component: AboutMeSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof AboutMeSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Guards the anchor contract — see HeroSection.stories.tsx for why this is the
// only thing checking it.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("#about"),
      "AboutMeSection must keep id='about' — the header nav targets #about.",
    ).not.toBeNull();
  },
};

// CssCheck (the single one for the whole project): a canary proving the Chakra theme
// actually loaded in the shared preview. AboutMeSection now renders its own <section>
// with bg="bg.band" (#122527 -> rgb(18, 37, 39)); an unstyled render would not match.
// The expected value is hardcoded ON PURPOSE — deriving it from the theme would make the
// assertion tautological (it would pass even if CSS never loaded).
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("section");
    await expect(section).not.toBeNull();
    await expect(
      getComputedStyle(section!).backgroundColor,
      "Expected AboutMeSection's bg to resolve to the theme's bg.band. If you changed bg.band in src/lib/theme.ts, update this value; otherwise the ChakraProvider/theme likely isn't loading in .storybook/preview.tsx.",
    ).toBe("rgb(18, 37, 39)");
  },
};
