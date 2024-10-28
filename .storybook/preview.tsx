import type { Preview } from "@storybook/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/lib/theme";
import { titilliumWeb } from "@/lib/fonts/titillium-web";
import { mulish } from "@/lib/fonts/mullish";

const preview: Preview = {
  decorators: [
    (Story) => (
      <ChakraProvider value={system}>
        <style jsx global>
          {`
            :root {
              --font-tw: ${titilliumWeb.style.fontFamily};
              --font-mulish: ${mulish.style.fontFamily};
            }
          `}
        </style>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;
