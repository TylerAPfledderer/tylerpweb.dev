import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { OpenSourceItemCard } from "./OpenSourceItemCard";
import { openSourceData } from "./utils";

// Like ProjectItemCard, this card only ever rendered behind the lazyMounted
// Open Source tab, so no story mounted it. This baselines it before the redesign
// restyle.
const meta = {
  component: OpenSourceItemCard,
  tags: ["ai-generated"],
} satisfies Meta<typeof OpenSourceItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: openSourceData[0],
  play: async ({ canvas }) => {
    // The card's own concern: both actions render as real <a> elements (the
    // Button asChild + Link wiring), with translated labels resolved. Href
    // values are utils.ts echoed back, so they aren't asserted.
    await expect(
      canvas.getByRole("link", { name: /contribution/i }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: /project/i }),
    ).toBeInTheDocument();
  },
};

// The other real item (Ethereum.org): a second role + a two-paragraph body, so
// the description.map() branch is exercised — the card renders one <p> per
// description entry, which the single-paragraph default does not prove.
export const EthereumOrg: Story = {
  args: openSourceData[1],
  play: async ({ canvas }) => {
    const paragraphs = canvas.getAllByText(/./, { selector: "p" });
    await expect(paragraphs.length).toBeGreaterThanOrEqual(
      openSourceData[1].description.length,
    );
  },
};
