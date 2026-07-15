import * as React from "react";
import type { Preview } from "@storybook/react-vite";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";

import theme from "../src/lib/theme";
import i18n from "./i18n";

// The app injects these font CSS vars from next/font in _app.tsx. Storybook can't fetch
// Google Fonts offline, so supply static fallbacks under the same var names the theme
// references (var(--font-tw) / var(--font-mulish)).
const fontVars = {
  "--font-tw": "'Titillium Web', system-ui, sans-serif",
  "--font-mulish": "'Mulish', system-ui, sans-serif",
} as React.CSSProperties;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ChakraProvider theme={theme}>
          <div style={fontVars}>
            <Story />
          </div>
        </ChakraProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;