import type { StorybookConfig } from "@storybook/nextjs";
import * as path from "path";

const config: StorybookConfig = {
  stories: ["../src/__stories__/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve?.alias,
        "@/lib": path.resolve(__dirname, "../src/lib"),
      };
    }

    return config;
  },
};
export default config;
