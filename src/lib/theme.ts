import { extendBaseTheme, theme } from "@chakra-ui/react";

export default extendBaseTheme({
  styles: {
    global: {
      body: {
        bg: "background",
        color: "body",
        fontSize: "md",
        lineHeight: "1",
      },
      p: {
        _notLast: {
          mb: "text.base",
        },
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
        dark: "#C28B00",
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
    "2xl": "3.16rem",
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
  components: {
    Heading: {
      baseStyle: {
        fontFamily: "heading",
        letterSpacing: "wide",
      },
      sizes: {
        "4xl": {
          fontSize: ["2xl", "3xl", "4xl"],
          lineHeight: ["2", null, "3"],
        },
        "3xl": {
          fontSize: ["xl", "2xl", "3xl"],
          lineHeight: ["1", "2", null],
        },
        "2xl": {
          fontSize: ["lg", "xl", "2xl"],
          lineHeight: ["1", null, "2"],
        },
      },
      defaultProps: {
        size: "3xl",
      },
    },
    Button: {
      baseStyle: {
        ...theme.components.Button.baseStyle,
        ...theme.components.Button.sizes?.lg,
        color: "background",
        bg: "secondary.base",
        _hover: {
          bg: "secondary.light",
        },
        _active: {
          bg: "secondary.dark",
        },
      },
    },
  },
});
