import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const configDir =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(viteConfig, {
      // The root tsconfig sets `jsx: "preserve"` for Next.js, which Vite/esbuild can't
      // parse. Override it so Vite transforms JSX with the automatic runtime.
      esbuild: { jsx: "automatic" },
      // Storybook serves `public/` via `staticDirs`, so disable Vite's own publicDir
      // handling — that lets i18n.ts import the locale JSON from public/ without Vite's
      // "assets in public directory cannot be imported" warning.
      publicDir: false,
      resolve: {
        // Resolve the tsconfig `@/*` aliases (@/components, @/data, @/svg-icons) natively.
        tsconfigPaths: true,
        // preview.tsx's trackFocusVisible() pre-seed only works if it seeds the SAME module
        // instance Chakra's zag machines later use — the guard it populates
        // (`listenerMap`) is module-level state. Two copies = two listenerMaps = the
        // pre-seed silently no-ops and the "Illegal invocation" storm returns.
        // The `^` range in package.json makes bun dedupe on an @ark-ui bump; this collapses
        // them in the bundle even if two ever land on disk (e.g. an ark MAJOR bump the
        // caret cannot satisfy). Belt and braces, because the failure mode is silent.
        dedupe: ["@zag-js/focus-visible"],
        alias: {
          // next/image needs the Next runtime, which the react-vite builder doesn't
          // provide (Storybook 10's Next framework requires Next 14.1+; this repo is on
          // 13.4.5). Unstubbed it throws `process is not defined` at module scope.
          // ProjectItemCard is its only importer and sits behind the Projects tab, which
          // lazyMounts — so this went unnoticed until a story actually activated that tab.
          //
          // This alias supersedes the `define: { "process.env.__NEXT_IMAGE_OPTS" }` that
          // #23 used for the same crash: aliasing rewrites the specifier, so the real
          // next/image module never loads and there is no `process` read to substitute.
          // The alias is the stronger of the two — it also RENDERS (a chakra <img>
          // honouring `fill`), which the define cannot, and which the PR2 fan-out needs
          // when it finally mounts the cards. The define was removed on merge rather than
          // left as unreachable config with a comment claiming it does the work.
          "next/image": path.join(configDir, "mocks/next-image.tsx"),
          // @chakra-ui/next-js wraps next/image and needs the Next runtime, which the
          // react-vite builder doesn't provide (Storybook 10 requires Next 14.1+). Stub
          // it for Storybook; the package is removed from the app in PR1.
          "@chakra-ui/next-js": path.join(
            configDir,
            "mocks/chakra-next-js.tsx",
          ),
        },
      },
    });
  },
};

export default config;
