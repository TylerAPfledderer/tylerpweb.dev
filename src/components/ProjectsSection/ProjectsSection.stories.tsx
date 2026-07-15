import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProjectsSection } from "./index";

const meta = {
  component: ProjectsSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof ProjectsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
