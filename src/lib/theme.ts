import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-tw)" },
        body: { value: "var(--font-mulish)" },
      },
      fontSizes: {
        sm: { value: "1rem" },
        md: { value: "1.33rem" },
        lg: { value: "1.78rem" },
        xl: { value: "2.37rem" },
        "2xl": { value: "3.16rem" },
        "3xl": { value: "4.21rem" },
        "4xl": { value: "5.61rem" },
      },
      lineHeights: {
        "1": { value: "2.375rem" },
        "1.5": { value: "3.56rem" },
        "2": { value: "4.75rem" },
        "3": { value: "7.125rem" },
      },
    },
    textStyles: {
      "4xl": {
        value: {
          fontSize: ["2xl", "3xl", "4xl"],
          lineHeight: ["2", null, "3"],
          letterSpacing: "wide",
        },
      },
      "3xl": {
        value: {
          fontSize: ["xl", "2xl", "3xl"],
          lineHeight: ["1.5", "2", null],
        },
      },

      "2xl": {
        value: {
          fontSize: ["lg", "xl", "2xl"],
          lineHeight: ["1", null, "2"],
        },
      },
    },
    recipes: {
      heading: {
        base: {
          fontFamily: "heading",
          letterSpacing: "wide",
          textWrap: "balance",
        },
      },
    },
  },
});
