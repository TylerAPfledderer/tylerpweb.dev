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

// CssCheck (the single one for the whole project): proves the Chakra theme actually
// loaded in the shared preview. AboutMeSection's MainSection renders as <section> with
// bg="primary.base" (#297B91 -> rgb(41, 123, 145)) — an unstyled render would not match.
export const CssCheck: Story = {
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector("section");
    await expect(section).not.toBeNull();
    await expect(getComputedStyle(section!).backgroundColor).toBe(
      "rgb(41, 123, 145)",
    );
  },
};
