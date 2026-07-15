import type { Preview } from "@storybook/react-vite";
import { ChakraProvider } from "@chakra-ui/react";
import { I18nextProvider } from "react-i18next";

// Register the @font-face rules, mirroring _app.tsx. Without these nothing loads the
// actual files, so any machine lacking the fonts locally (e.g. Chromatic's Linux capture
// container) silently falls back to a system font. Keep the weights in sync with
// _app.tsx so Storybook renders what production renders.
import "@fontsource/titillium-web/700.css";
import "@fontsource/mulish/400.css";
// Defines --font-tw / --font-mulish at :root, which is where the theme's font tokens
// resolve them. See the file for why a decorator-level wrapper cannot work.
import "./fonts.css";

import theme from "../src/lib/theme";
import i18n from "./i18n";

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
          <Story />
        </ChakraProvider>
      </I18nextProvider>
    ),
  ],
};

export default preview;