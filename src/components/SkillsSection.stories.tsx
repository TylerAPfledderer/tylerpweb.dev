import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

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
