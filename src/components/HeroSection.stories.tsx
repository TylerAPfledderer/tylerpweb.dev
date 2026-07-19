import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { HeroSection } from "./HeroSection";
import { socialMediaLinks } from "@/data";

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

    // The redesign's new second CTA — Hero is the only #contact referrer besides
    // the header, so this guards that fragment the same way.
    await expect(
      canvasElement.querySelector('a[href="#contact"]'),
      "Hero's secondary CTA must target #contact.",
    ).not.toBeNull();
  },
};

// Guards the social-pill wiring: the redesign renders one pill per
// socialMediaLinks entry (shortLabel text, except Email which is a t() key), and
// each pill's href must match its data entry. A silent data/label drift here
// would ship broken or mislabelled social links with no other gate catching it.
export const SocialPills: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvasElement.querySelector('ul[aria-label="Social media"]');
    await expect(list).not.toBeNull();
    const anchors = list!.querySelectorAll("a");
    await expect(anchors.length).toBe(socialMediaLinks.length);

    for (const { href, shortLabel, platform } of socialMediaLinks) {
      // Email's pill text is a t() key ("Email"); every other is the shortLabel.
      const text = platform === "Email" ? "Email" : shortLabel;
      const pill = canvas.getByRole("link", { name: `My ${platform}` });
      await expect(pill).toHaveAttribute("href", href);
      await expect(pill).toHaveTextContent(text);
    }
  },
};
