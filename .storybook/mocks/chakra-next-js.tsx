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
 * Storybook-only stub for `@chakra-ui/next-js`, which wraps `next/image` and needs the
 * Next.js runtime the framework-agnostic react-vite builder doesn't provide. Renders a
 * plain Chakra `<img>`, dropping next/image-only props so they don't leak to the DOM.
 * `fill` is honored (absolute + 100%/100%) so `objectFit` behaves like the real component
 * — ProjectItemCard relies on it to cover-fill its fixed-height card. Removed in PR1.
 */
export const Image = ({
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
