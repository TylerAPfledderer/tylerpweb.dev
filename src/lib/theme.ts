import { extendBaseTheme } from "@chakra-ui/react";

export default extendBaseTheme({
  styles: {
    global: {
      body: {
        bg: "background",
        color: "body",
        lineHeight: "none",
      },
    },
  },
  semanticTokens: {
    colors: {
      primary: {
        base: "#297B91",
        dark: "#1F5E6F",
      },
      secondary: {
        base: "#FFB700",
        light: "#FFD15C",
        dark: "#FFB700",
      },
      background: "#182326",
      body: "white",
    },
  },
  fonts: {
    heading: "var(--font-tw)",
    body: "var(--font-mulish)",
  },
  fontSizes: {
    sm: "1rem",
    md: "1.33rem",
    lg: "1.78rem",
    xl: "2.37rem",
    "2xl": "3.16",
    "3xl": "4.21rem",
    "4xl": "5.61rem",
  },
  lineHeights: {
    "1": "2.375rem",
    "2": "4.75rem",
    "3": "7.125rem",
  },
  space: {
    text: {
      sm: "1.188rem",
      base: "2.375rem",
      md: "3.563rem",
      lg: "4.75rem",
      xl: "5.938rem",
      "2xl": "7.125rem",
      "3xl": "8.313rem",
      "4xl": "9.5rem",
    },
  },
});
