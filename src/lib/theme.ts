import { extendBaseTheme, ChakraTheme, theme } from "@chakra-ui/react";

const themeConfig: Partial<ChakraTheme> = {
  fonts: {
    heading: "var(--font-tw)",
    body: "var(--font-mulish)",
  },
};

export default extendBaseTheme(themeConfig);
