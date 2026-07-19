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

// The redesign's three contact actions are the section's whole point, so pin
// their hrefs: the mailto and the two social links are the actual contract a
// visitor depends on. Queried by accessible name (link text).
export const ContactActions: Story = {
  play: async ({ canvas }) => {
    const email = canvas.getByRole("link", {
      name: "tyler.pfledderer@gmail.com",
    });
    await expect(email).toHaveAttribute(
      "href",
      "mailto:tyler.pfledderer@gmail.com",
    );

    await expect(canvas.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/tyler-pfledderer",
    );
    await expect(canvas.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/tylerapfledderer",
    );
  },
};
