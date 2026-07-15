"use client";

import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { system } from "../../lib/theme";

// App has no color mode (no dark theme), so this is a thin wrapper over ChakraProvider
// with the project's custom system. Shared by _app.tsx and the Storybook preview.
export function Provider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
