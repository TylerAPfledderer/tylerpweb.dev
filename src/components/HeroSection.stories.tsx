import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { HeroSection } from "./HeroSection";

const meta = {
  component: HeroSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Guards the anchor contract, which NOTHING else in this project checks: a dead
// in-page anchor throws no error, logs nothing, fails no typecheck or build, and
// axe does not verify that a fragment resolves. The header nav links to all five
// section ids, so a section PR that rewrites this component and drops its id
// would break navigation silently.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector("#top"),
      "HeroSection must keep id='top' — the header brand link targets #top.",
    ).not.toBeNull();

    // The other half of an atomic pair: the id moved off ProjectsSection's
    // <Heading id="projects-contributions"> onto its section as id="work", and
    // this CTA is that id's only referrer. Split across two PRs, this href would
    // dangle in between.
    await expect(
      canvasElement.querySelector('a[href="#work"]'),
      "Hero's CTA must target #work (renamed from #projects-contributions).",
    ).not.toBeNull();
  },
};
