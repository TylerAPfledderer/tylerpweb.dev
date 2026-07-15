import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { ProjectsSection } from "./index";

const meta = {
  component: ProjectsSection,
  tags: ["ai-generated"],
} satisfies Meta<typeof ProjectsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// WCAG relative luminance / contrast, per https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio.
// Hand-rolled because the assertion must not depend on the theme it is checking.
const luminance = ([r, g, b]: number[]) => {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const rgb = (value: string) => value.match(/\d+/g)!.slice(0, 3).map(Number);
const contrast = (fg: string, bg: string) => {
  const [hi, lo] = [luminance(rgb(fg)), luminance(rgb(bg))].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

// Walk up for the first non-transparent background — a trigger's own bg is transparent
// when idle, so its real backdrop is the list behind it.
const backdropOf = (el: Element) => {
  let node: Element | null = el;
  while (node) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
    node = node.parentElement;
  }
  return "rgb(255, 255, 255)";
};

// Guards the regression found in PR2: v3's `enclosed` recipe styles the idle trigger with
// fg.muted on a bg.muted list. Both are v3 defaults whose _light branch wins on this
// color-mode-less site, so the redesign's dark-canvas fg.muted rendered at 1.84:1 on a
// gray-100 tablist — a WCAG AA failure that typechecked clean and that Chromatic reported
// only as a diff to eyeball. Asserting the ratio (not a hex) keeps this honest if the
// design's neutrals are retuned later.
export const TabContrast: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const idle = canvas.getByRole("tab", { selected: false });
    const selected = canvas.getByRole("tab", { selected: true });

    await step("idle tab label meets WCAG AA against its real backdrop", async () => {
      const ratio = contrast(getComputedStyle(idle).color, backdropOf(idle));
      await expect(
        ratio,
        `Idle tab label is ${ratio.toFixed(2)}:1 against its backdrop. It must be >= 4.5:1. If this fails, the tab is likely inheriting one of v3's default _light surfaces again (bg.muted / fg.muted) instead of the design tokens pinned in ProjectsSection/index.tsx.`,
      ).toBeGreaterThanOrEqual(4.5);
    });

    await step("selected tab label meets WCAG AA", async () => {
      const ratio = contrast(getComputedStyle(selected).color, backdropOf(selected));
      await expect(
        ratio,
        `Selected tab label is ${ratio.toFixed(2)}:1 against its backdrop. It must be >= 4.5:1.`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  },
};

// The tabs are the section's only interactive control, and selection drives which list is
// mounted (lazyMount + unmountOnExit), so the swap is real business logic, not decoration.
export const SwitchesToProjectsTab: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Projects tab starts unselected", async () => {
      await expect(
        canvas.getByRole("tab", { name: /projects/i }),
      ).toHaveAttribute("aria-selected", "false");
    });

    await step("activating it reveals the personal projects list", async () => {
      await userEvent.click(canvas.getByRole("tab", { name: /projects/i }));
      await expect(
        canvas.getByRole("tab", { name: /projects/i }),
      ).toHaveAttribute("aria-selected", "true");
      await expect(
        await canvas.findByRole("list", { name: "Personal Projects" }),
      ).toBeVisible();
    });

    await step("the newly selected tab still meets WCAG AA", async () => {
      const selected = canvas.getByRole("tab", { selected: true });
      const ratio = contrast(getComputedStyle(selected).color, backdropOf(selected));
      await expect(
        ratio,
        `Selected tab label is ${ratio.toFixed(2)}:1 against its backdrop. It must be >= 4.5:1.`,
      ).toBeGreaterThanOrEqual(4.5);
    });
  },
};
