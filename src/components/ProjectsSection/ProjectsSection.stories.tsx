import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";

import { ProjectsSection } from "./index";

const meta = {
  component: ProjectsSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof ProjectsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per tab. The cards render only inside their tab panel (Tabs uses
// lazyMount + unmountOnExit), so covering them THROUGH the section — rather than
// as standalone card stories — mounts each card in its real container context
// (OSS flex-wrap, projects minmax grid), giving axe and Chromatic authentic
// widths without simulated width decorators.

// Open Source is the default tab, so its cards are mounted on load. This story
// also guards the anchor contract: #work was RENAMED here (off the old
// <Heading id="projects-contributions"> onto the section) and its only referrer
// is HeroSection's CTA in another file, so nothing else checks it.
export const OpenSourceTab: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(
      canvasElement.querySelector("#work"),
      "ProjectsSection must keep id='work' — the header nav and hero CTA target #work.",
    ).not.toBeNull();
    await expect(
      canvasElement.querySelector("#projects-contributions"),
      "The old id must not come back — it would duplicate the anchor target.",
    ).toBeNull();

    // Both OSS cards are mounted in the default panel — each has a contributions
    // action, so assert the set is non-empty (getByRole would throw on 2 matches).
    await expect(
      canvas.getAllByRole("link", { name: /contribution/i }).length,
    ).toBeGreaterThan(0);
  },
};

// Activating the Projects tab mounts the project cards (lazyMount). Without this
// interaction no story reaches them — the coverage gap the card baselines closed.
export const ProjectsTab: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("tab", { name: /projects/i }));
    // Wait for the lazyMounted panel to render — every project card has a Source
    // action, so assert the set is non-empty (getByRole would throw on the 5
    // matches).
    await waitFor(async () => {
      await expect(
        canvas.getAllByRole("link", { name: /source/i }).length,
      ).toBeGreaterThan(0);
    });
  },
};
