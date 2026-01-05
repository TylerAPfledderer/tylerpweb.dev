import { createSystem, defaultConfig } from "@chakra-ui/react";

const customConfig = {
  theme: {
    tokens: {
      colors: {
        primary: {
          base: { value: "#297B91" },
          dark: { value: "#1F5E6F" },
        },
        secondary: {
          base: { value: "#FFB700" },
          light: { value: "#FFD15C" },
          dark: { value: "#C28B00" },
        },
        background: { value: "#182326" },
        body: { value: "white" },
      },
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
      spacing: {
        "text.sm": { value: "1.188rem" },
        "text.base": { value: "2.375rem" },
        "text.md": { value: "3.563rem" },
        "text.lg": { value: "4.75rem" },
        "text.xl": { value: "5.938rem" },
        "text.2xl": { value: "7.125rem" },
        "text.3xl": { value: "8.313rem" },
        "text.4xl": { value: "9.5rem" },
      },
    },
  },
  globalCss: {
    body: {
      bg: "background",
      color: "body",
      fontSize: "md",
      lineHeight: "1",
    },
    "p:not(:last-child)": {
      mb: "text.base",
    },
  },
};

export default createSystem(defaultConfig, customConfig);
