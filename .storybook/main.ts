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
    // Lints the manifest addon-mcp emits (`/manifests/components.json`) — the artifact a
    // coding agent actually reads this repo through. Without it, a component whose docs
    // never reach that manifest looks identical to one that has none: the agent sees an
    // undocumented component and nothing anywhere says so. Same failure class as the a11y
    // gate that "looks configured" while running nothing. Panel is per-story; the same
    // rules run headlessly over the built manifest via `bun run oversight`.
    "storybook-addon-oversight",
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  // Pinned EXPLICITLY, and it is not the value the addon's README recommends.
  //
  // Oversight suggests `react-docgen-typescript`, which extracts JSDoc off TS types that
  // plain `react-docgen` misses. On this stack it does not merely underperform — it fails
  // outright: every component comes back `Cannot read properties of undefined (reading
  // 'readFile')` (`ts.sys` is undefined), taking docgen from 5 of 6 components extracting
  // to 0 of 6. An explicit `tsconfigPath` does not help. Suspected TS 5.1.3 (Jun 2023) vs.
  // Storybook 10.5's integration; **revisit at PR3** with the TS/Next bump, alongside the
  // `@storybook/nextjs-vite` framework question components.md already defers there.
  //
  // What makes this worth pinning rather than leaving to the default: `build-storybook`
  // exits 0 and prints "completed successfully" in BOTH states. The extractor can be
  // switched to something that extracts nothing at all and no gate in this repo says a
  // word. `expectedExtractor` in manager.ts is set to this same value so `extractor-drift`
  // fires if the two ever part ways.
  typescript: { reactDocgen: "react-docgen" },
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
