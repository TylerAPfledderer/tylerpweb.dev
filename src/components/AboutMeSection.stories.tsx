import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { AboutMeSection } from "./AboutMeSection";

const meta = {
  component: AboutMeSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof AboutMeSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// CssCheck (the single one for the whole project): a canary proving the Chakra theme
// actually loaded in the shared preview. AboutMeSection's MainSection renders as <section>
// with bg="primary.base" (#297B91 -> rgb(41, 123, 145)); an unstyled render would not match.
// The expected value is hardcoded ON PURPOSE — deriving it from the theme would make the
// assertion tautological (it would pass even if CSS never loaded).
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("section");
    await expect(section).not.toBeNull();
    await expect(
      getComputedStyle(section!).backgroundColor,
      "Expected AboutMeSection's bg to resolve to the theme's primary.base. If you changed primary.base in src/lib/theme.ts, update this value; otherwise the ChakraProvider/theme likely isn't loading in .storybook/preview.tsx.",
    ).toBe("rgb(41, 123, 145)");
  },
};
