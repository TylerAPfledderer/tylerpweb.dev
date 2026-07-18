import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { ProjectItemCard } from "./ProjectItemCard";
import { projectsData } from "./utils";

// FIRST story to ever mount ProjectItemCard. Until now the card sat behind
// ProjectsSection's lazyMounted/unmountOnExit Projects tab, so no story reached
// it — axe never saw it, Chromatic never baselined it, and the next/image mock
// was never exercised at render. This story closes that gap BEFORE the redesign
// restyle, so Chromatic has a real baseline to diff the restyle against.
const meta = {
  component: ProjectItemCard,
  tags: ["ai-generated"],
} satisfies Meta<typeof ProjectItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// idx 0 → even index → the `row` (image-left) layout branch.
export const Default: Story = {
  args: { idx: 0, ...projectsData[0] },
  play: async ({ canvas }) => {
    // The card's own concern: both actions render as real <a> elements (the
    // Button asChild + Link wiring — a flattened `as` would emit a <div> and
    // silently drop link semantics), with their translated labels resolved.
    // The href VALUES are just utils.ts echoed back, so they aren't asserted.
    await expect(canvas.getByRole("link", { name: /github/i })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: /demo/i })).toBeInTheDocument();
  },
};

// idx 1 → odd index → the `row-reverse` (image-right) layout branch. Guards the
// index-parity branching in the card's border/radius logic.
export const OddIndex: Story = {
  args: { idx: 1, ...projectsData[1] },
};
