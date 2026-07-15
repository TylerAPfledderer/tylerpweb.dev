import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineRecipe,
} from "@chakra-ui/react";

// Heading: v2 baseStyle + custom responsive sizes. v2 responsive arrays
// (["2xl","3xl","4xl"] = base/sm/md) are ported to v3 breakpoint objects.
// textStyle:"none" neutralises the textStyle each v3 default size composes in
// (4xl's carries letterSpacing:-0.025em, which would otherwise beat the base
// letterSpacing:"wide"). v2 had no default Heading recipe to merge with.
const headingRecipe = defineRecipe({
  base: {
    fontFamily: "heading",
    letterSpacing: "wide",
    textWrap: "balance",
  },
  variants: {
    size: {
      "4xl": {
        textStyle: "none",
        fontSize: { base: "2xl", sm: "3xl", md: "4xl" },
        lineHeight: { base: "2", md: "3" },
      },
      "3xl": {
        textStyle: "none",
        fontSize: { base: "xl", sm: "2xl", md: "3xl" },
        lineHeight: { base: "1.5", sm: "2" },
      },
      "2xl": {
        textStyle: "none",
        fontSize: { base: "lg", sm: "xl", md: "2xl" },
        lineHeight: { base: "1", md: "2" },
      },
    },
  },
  defaultVariants: {
    size: "3xl",
  },
});

// Button: v2 baked the "lg" size into baseStyle; in v3 that's defaultVariants.
// fontSize lives in the size variant (not base) because Chakra's default
// size.lg carries textStyle:"md", and variants are applied after base.
const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      solid: {
        color: "background",
        bg: "secondary.base",
        _hover: { bg: "secondary.light" },
        _active: { bg: "secondary.dark" },
      },
      outline: {
        borderWidth: "2px",
        borderColor: "body",
        // v2 inherited white from body; v3's default outline variant would
        // otherwise supply colorPalette.fg (near-black on our dark surface).
        color: "body",
        _hover: { bg: "body", color: "background" },
        _active: { opacity: 0.6 },
      },
    },
    size: {
      // textStyle:"none" drops the default size.lg's textStyle:"md" (which
      // would override fontSize and force lineHeight to 1.5rem); the real lg
      // dimensions still merge in from Chakra's default button recipe.
      lg: { textStyle: "none", fontSize: "sm" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "lg",
  },
});

const config = defineConfig({
  globalCss: {
    // v3's default globalCss sets html{bg:"bg"} (white). Without matching it
    // here, background-propagation stops and overscroll areas flash white.
    html: {
      bg: "background",
    },
    body: {
      bg: "background",
      color: "body",
      fontSize: "md",
      lineHeight: "1",
    },
    // _notLast is v3's condition for :not(:last-of-type) — a 1:1 port of the v2
    // source. A hand-written :not(:last-child) is NOT equivalent: it would also
    // match a <p> followed by a non-<p> sibling (e.g. the hero's scroll notice
    // above its arrow icon), adding margin v2 never applied.
    p: {
      _notLast: {
        mb: "text.base",
      },
    },
  },
  theme: {
    // Keyframes referenced by name via animationName (v3 dropped the `keyframes`
    // export). Used by SocialLinksList's icon hover animation.
    keyframes: {
      waggle: {
        "10%": { transform: "scale(0.8) rotate(-20deg)" },
        "40%": { transform: "scale(1.9) rotate(10deg)" },
        "60%": { transform: "scale(1.6) rotate(-10deg)" },
        "100%": { transform: "scale(1.4)" },
      },
    },
    tokens: {
      // Plain tokens, not semanticTokens: the app has no color mode, and in
      // semanticTokens `base` is the default-condition key, so `primary.base`
      // would collapse to `primary` and every `.base` call site would emit
      // raw, invalid CSS.
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
      // v3 dropped the container.* sizes scale; re-added with the v2 values so
      // the maxW="container.*" call sites keep their caps.
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
        },
      },
      // Self-hosted font families via CSS vars (see _app.tsx / @fontsource).
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
      // Custom typographic spacing scale; referenced as gap="text.base" etc.
      spacing: {
        text: {
          sm: { value: "1.188rem" },
          base: { value: "2.375rem" },
          md: { value: "3.563rem" },
          lg: { value: "4.75rem" },
          xl: { value: "5.938rem" },
          "2xl": { value: "7.125rem" },
          "3xl": { value: "8.313rem" },
          "4xl": { value: "9.5rem" },
        },
      },
    },
    recipes: {
      heading: headingRecipe,
      button: buttonRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);

export default system;
