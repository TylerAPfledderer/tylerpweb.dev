import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { ProjectsSection } from "./index";

const meta = {
  component: ProjectsSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof ProjectsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Guards the anchor contract — see HeroSection.stories.tsx for why this is the
// only thing checking it. This id carries the highest risk of the five: it was
// RENAMED here (off the <Heading id="projects-contributions"> onto the section as
// id="work"), and its only referrer lives in a different file (HeroSection's CTA).
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("#work"),
      "ProjectsSection must keep id='work' — the header nav and hero CTA target #work.",
    ).not.toBeNull();

    await expect(
      canvasElement.querySelector("#projects-contributions"),
      "The old id must not come back — it would duplicate the anchor target.",
    ).toBeNull();
  },
};
