import * as React from "react";
import { chakra } from "@chakra-ui/react";

const ChakraImg = chakra("img");

type NextImageOnlyProps = {
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  sizes?: string;
  loader?: unknown;
};

/**
 * Storybook-only stub for `next/image`, which pulls in the Next.js runtime that the
 * framework-agnostic react-vite builder does not provide — importing it for real throws
 * `ReferenceError: process is not defined` at module scope.
 *
 * This mirrors `chakra-next-js.tsx`, which stubbed the SAME underlying problem via
 * `@chakra-ui/next-js`. PR1 dropped that package and moved ProjectItemCard to a direct
 * `next/image` import, which silently made that alias a no-op: the only importer sits
 * behind the Projects tab, and Tabs uses lazyMount + unmountOnExit, so no story ever
 * mounted it and nothing failed. Revisit at PR3 — Next 16 unlocks @storybook/nextjs-vite,
 * which handles next/image natively and makes both stubs unnecessary.
 *
 * `src` is a plain `/images/...` string served from `public/` via staticDirs, so a bare
 * <img> resolves it. `fill` is honored (absolute + 100%/100%) so the caller's `objectFit`
 * cover-fills its fixed-height card the way the real component does.
 */
const NextImageStub = ({
  fill,
  priority: _priority,
  quality: _quality,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  sizes: _sizes,
  loader: _loader,
  ...rest
}: React.ComponentProps<typeof ChakraImg> & NextImageOnlyProps) => (
  <ChakraImg
    {...(fill ? { position: "absolute", inset: 0, w: "100%", h: "100%" } : {})}
    {...rest}
  />
);

export default NextImageStub;
