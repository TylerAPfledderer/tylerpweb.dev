import type { Meta, StoryObj } from "@storybook/react-vite";

import { SkillsSection } from "./SkillsSection";

const meta = {
  component: SkillsSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof SkillsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
