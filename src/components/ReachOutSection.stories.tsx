import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { ReachOutSection } from "./ReachOutSection";

const meta = {
  component: ReachOutSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof ReachOutSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Guards the anchor contract — see HeroSection.stories.tsx for why this is the
// only thing checking it. NOTE this component becomes ContactSection in its own
// section PR; the id must survive the rename.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("#contact"),
      "ReachOutSection must keep id='contact' — the header nav and hero CTA target #contact.",
    ).not.toBeNull();
  },
};
