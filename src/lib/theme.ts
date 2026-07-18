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
    // v2's extendBaseTheme emptied `components`, so Heading had no default recipe and
    // inherited normal weight. v3 merges its default recipe, which sets semibold.
    fontWeight: "normal",
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

// Link: THE highest-value recipe here, and the only mechanism that works.
//
// v3's link recipe is defaultVariants:{variant:"plain"}, and `plain` sets
// color:"colorPalette.fg" → --chakra-colors-gray-fg → _light → gray.800
// (#27272a). With no colour mode the _light branch always wins, so an UNSTYLED
// <Link> renders near-black on this dark canvas — measured 1.24:1 in the header
// and 1.09:1 in About. It typechecks clean.
//
// The intuitive central fix does NOT work: porting the design's global
// `a { color:#56c4da }` into globalCss puts it in the `base` layer, and layer
// order is reset(0) base(1) tokens(2) recipes(3) — the link recipe would
// silently win. Only a recipe beats a recipe.
//
// Overriding here REPLACES plain.color while v3's base (display/gap/
// focusVisibleRing) and the `underline` variant still merge through.
const linkRecipe = defineRecipe({
  variants: {
    variant: {
      plain: {
        color: "accent.emphasis",
        // The design sets text-decoration:none globally. v3's plain._hover adds
        // an underline; this deep-MERGES, so "none" is required to suppress it.
        // Its textUnderlineOffset/textDecorationColor siblings survive and are
        // inert once there is no underline to draw.
        textDecoration: "none",
        transition: "color .18s ease",
        _hover: { color: "accent.bright", textDecoration: "none" },
      },
    },
  },
});

// Button: the design's three weights (DesignSystem §04, which now carries the
// Portfolio's real values rather than the stale specimen board it used to).
//
// Names are deliberately NOT changed: `solid` was already the amber primary and
// `outline` already existed, so every current call site keeps working and simply
// picks up the redesign values. `solidTeal` is the one addition.
//
// Two design shapes are intentionally absent because each has a single consumer:
// the 999px nav pill (Header) and the 11px/14.5px card button (Work). Their
// section PRs own them; a shared recipe should have >=2 consumers.
const buttonRecipe = defineRecipe({
  base: {
    // The design's buttons are anchors laid out as inline-flex with a real touch
    // target, not h-sized boxes. minH 44px is the design's own a11y floor.
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minH: "44px",
    px: "30px",
    // 13px. v3's base uses the l2 semantic radius (4px).
    borderRadius: "0.8125rem",
    // v3's base adds a 1px transparent border, which would make every button 2px
    // wider than the design. outlineTeal re-asserts its own.
    borderWidth: "0",
    whiteSpace: "nowrap",
  },
  variants: {
    variant: {
      solid: {
        bg: "warm.solid",
        color: "warm.contrast",
        fontWeight: "700",
        _hover: { bg: "warm.emphasis" },
      },
      solidTeal: {
        bg: "accent.solid",
        color: "accent.contrast",
        fontWeight: "700",
        _hover: { bg: "accent.emphasis" },
      },
      outline: {
        borderWidth: "1px",
        borderColor: "rgba(86,196,218,.28)",
        // #dbeceb. One of NINE greys the design uses and does not name — the DS
        // documents only Ink (#eaf3f2) and Muted. Raw until that ramp is settled.
        color: "#dbeceb",
        fontWeight: "600",
        _hover: {
          borderColor: "accent.emphasis",
          bg: "accent.wash",
        },
      },
    },
    size: {
      // 16.5px. textStyle:"none" neutralises the textStyle v3's default size
      // composes in, which would otherwise clobber fontSize and lineHeight.
      lg: {
        textStyle: "none",
        fontSize: "1.03125rem",
      },
      // 14.5px — the design's in-card action buttons (Work section cards). Tighter
      // horizontal padding than lg's 30px. textStyle:"none" for the same reason.
      sm: {
        textStyle: "none",
        fontSize: "0.90625rem",
        px: "5",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "lg",
  },
});

const config = defineConfig({
  // TOP-LEVEL, not under `theme` — nested there it typechecks and silently
  // vanishes. Adding one condition MERGES with v3's defaults (_hover, _dark, …);
  // it does not replace them. Author it bare, consume it prefixed: _skillsWide.
  //
  // This only NAMES the query. The element must still carry
  // containerType:"inline-size" + containerName:"skills" or it never fires.
  // Skills swaps its graphic on CONTENT width, not viewport, because the rail
  // needs 760px of its own box — a viewport query would lie about that.
  conditions: {
    skillsWide: "@container skills (min-width: 820px)",
  },
  globalCss: {
    // The background lives on html, NOT body. TWO independent reasons — the
    // second outlives the first, so do not "simplify" this rule away:
    //
    // 1. v3's default globalCss sets html{bg:"bg"}, which stops CSS
    //    background-propagation — so unlike v2, body paints its own background
    //    box. That box would cover AboutMe's skewed ::before (zIndex:-1),
    //    erasing the teal bleed above and below the section. STILL LIVE: About
    //    is un-redesigned as of this PR; the design drops the skew, so this
    //    reason expires when the About section PR lands.
    // 2. `colors.bg` is v3's semantic token, and with no colour mode it resolves
    //    its _light branch — WHITE. Deleting this rule does not fall back to
    //    "nothing"; it falls back to a white canvas. (We also pin bg.DEFAULT
    //    above, so both ends agree.) Moving the paint to body would need
    //    html:{bg:"transparent"} as well, to restore propagation.
    html: {
      bg: "bg.canvas",
      // v3's default html rule is lineHeight:"1.5" — the token NAME, which this
      // theme hijacks to a 3.56rem LENGTH. So <html> silently carries a 56.96px
      // line box, masked only by body's rule below. Pin it explicitly.
      lineHeight: "1.5625rem",
      scrollBehavior: "smooth",
      // Nested INSIDE the selector, not wrapped around it: globalCss types an
      // at-rule's value as an element-level style object, so a selector map in
      // there does not compile.
      "@media (prefers-reduced-motion: reduce)": {
        scrollBehavior: "auto",
      },
    },
    body: {
      color: "fg",
      // The design's Body role. Fluid 16→18px, saturating at a 450px viewport.
      // rem so it honours the reader's browser font-size.
      fontSize: "clamp(1rem, 4vw, 1.125rem)",
      // A FIXED length, not a ratio: this is what holds the 25px baseline while
      // fontSize ramps. Ratio 1.5625 at 16px, 1.389 at 18px.
      lineHeight: "1.5625rem",
    },
    // v3 owns this exact key (colorPalette.emphasized/80 → gray, since html sets
    // colorPalette:"gray"). Authoring "*::selection" REPLACES it; authoring
    // "::selection" would emit a SECOND rule at equal specificity and let
    // emission order decide. Use v3's key.
    "*::selection": {
      bg: "rgba(86,196,218,.28)",
    },
    // The design ships neither a reduced-motion guard nor a focus treatment,
    // while running smooth scroll + 21 animated instances. This PR introduces
    // both the scroll behaviour and the three keyframes, so it owns the guard.
    //
    // duration:0.01ms, NOT `animation:none`. The animations here resolve to
    // their FINAL state — drawrail ends at stroke-dashoffset:0, i.e. the rail
    // DRAWN. `animation:none` would instead leave each consumer's inline start
    // state (dashoffset:600 / :1) and hide the rail permanently.
    "*, *::before, *::after": {
      "@media (prefers-reduced-motion: reduce)": {
        animationDuration: "0.01ms !important",
        animationIterationCount: "1 !important",
        transitionDuration: "0.01ms !important",
        scrollBehavior: "auto !important",
      },
    },
    // v2's source was `p: { _notLast: {...} }`, i.e. :not(:last-of-type). Spelled out
    // flat because globalCss does not process the _notLast condition when nested under
    // a selector key — it silently emits no rule at all. Must stay :last-of-type, not
    // :last-child: the latter also matches a <p> followed by a non-<p> sibling (the
    // hero's scroll notice above its arrow icon), adding margin v2 never applied.
    "p:not(:last-of-type)": {
      mb: "line.1",
    },
  },
  theme: {
    // The design swaps the header nav at 640px. v3's `sm` is 480px, and the nav
    // measurably overflows it (by 3px in English; de/fr/pl need ~600px), so `sm`
    // is not a substitute on a 13-locale site.
    //
    // This MERGES with v3's sm/md/lg/xl/2xl (verified) and sorts by value, so
    // `nav` lands between sm(480) and md(768) — there is no cascade inversion.
    // But it DOES shift ARRAY responsive syntax, whose index 2 moves md → nav.
    // The one at-risk call site (HeroSection.tsx fontSize) is converted to object
    // syntax in this same PR; SocialLinksList's [base, sm] pair is unaffected.
    breakpoints: {
      nav: "640px",
    },
    // Keyframes referenced by name via animationName (v3 dropped the `keyframes`
    // export). Used by SocialLinksList's icon hover animation.
    keyframes: {
      waggle: {
        "10%": { transform: "scale(0.8) rotate(-20deg)" },
        "40%": { transform: "scale(1.9) rotate(10deg)" },
        "60%": { transform: "scale(1.6) rotate(-10deg)" },
        "100%": { transform: "scale(1.4)" },
      },
      // Redesign motif. Verbatim from the design; these MERGE with v3's 34
      // defaults (verified) and collide with none of them.
      //
      // drawrail is deliberately `to`-only: each consumer supplies its own start
      // state inline (Hero's rail uses stroke-dasharray/offset:600; Skills' uses
      // pathLength=1 + dasharray/offset:1). Moving the start state into the
      // keyframe would make it un-shareable between the two.
      drawrail: {
        to: { strokeDashoffset: "0" },
      },
      nodepop: {
        "0%": { transform: "scale(0)", opacity: "0" },
        "70%": { transform: "scale(1.25)" },
        "100%": { transform: "scale(1)", opacity: "1" },
      },
      fadeup: {
        from: { opacity: "0", transform: "translateY(16px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
    },
    // The design's type scale (DesignSystem.dc.html §02), as roles rather than
    // sizes — each row bundles size + line-height + weight + tracking + family,
    // which is exactly what a v3 textStyle is. Adding these MERGES with v3's
    // defaults (verified); it does not replace them.
    //
    // px in the design → rem here, so the scale honours the reader's browser
    // font-size. The `vw` term is intentionally left as-is (it is what makes the
    // ramp fluid); only the clamp endpoints scale with the root.
    //
    // Line-heights are FIXED LENGTHS, not ratios — that is what holds the design's
    // 25px baseline while the font-size ramps. A unitless ratio cannot: the box
    // would drift with the size. 1.5625rem = 25px = one line.
    textStyles: {
      display: {
        value: {
          fontFamily: "heading",
          fontSize: "clamp(2.875rem, 11vw, 5.375rem)",
          lineHeight: "clamp(3.125rem, 12.8vw, 6.25rem)",
          fontWeight: "700",
          letterSpacing: "-0.015em",
        },
      },
      h1: {
        value: {
          fontFamily: "heading",
          fontSize: "clamp(2.375rem, 5.5vw, 4rem)",
          lineHeight: "clamp(3.125rem, 6.44vw, 4.6875rem)",
          fontWeight: "700",
        },
      },
      h2: {
        value: {
          fontFamily: "heading",
          fontSize: "clamp(1.9375rem, 7vw, 3.4375rem)",
          lineHeight: "clamp(2.34375rem, 7.95vw, 3.90625rem)",
          fontWeight: "700",
        },
      },
      h3: {
        value: {
          fontFamily: "heading",
          fontSize: "clamp(1.375rem, 5vw, 1.75rem)",
          lineHeight: "clamp(1.5625rem, 6.7vw, 2.34375rem)",
          fontWeight: "600",
        },
      },
      lead: {
        value: {
          fontFamily: "body",
          fontSize: "clamp(1.125rem, 4.5vw, 1.40625rem)",
          lineHeight: "clamp(1.5625rem, 6.25vw, 1.953125rem)",
          fontWeight: "400",
        },
      },
      body: {
        value: {
          fontFamily: "body",
          fontSize: "clamp(1rem, 4vw, 1.125rem)",
          lineHeight: "1.5625rem",
          fontWeight: "400",
        },
      },
      small: {
        value: {
          fontFamily: "body",
          fontSize: "0.875rem",
          lineHeight: "1.5625rem",
          fontWeight: "500",
        },
      },
      // Kickers / tags / sha labels. The design pairs 13px with .24em uppercase.
      mono: {
        value: {
          fontFamily: "mono",
          fontSize: "0.8125rem",
          lineHeight: "1.5625rem",
          fontWeight: "500",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
        },
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
        // Redesign palette. These sub-keys are NOT among the ones v3's
        // defaultConfig owns as semanticTokens (it owns bg.subtle/muted/panel
        // and fg.DEFAULT), so they resolve correctly as plain tokens.
        // fg.muted / fg.subtle / border.subtle DO collide — see semanticTokens.
        bg: {
          canvas: { value: "#0b1617" },
          surface: { value: "#0f1e20" },
          band: { value: "#122527" },
        },
        accent: {
          solid: { value: "#33a6c0" },
          emphasis: { value: "#56c4da" },
          muted: { value: "#7fb6c2" },
          // Ink for text sitting ON accent.solid (the teal button / selected tab).
          contrast: { value: "#04191d" },
          // Link hover only. The design's global `a:hover`.
          bright: { value: "#8bd8e8" },
          // The design's recurring teal wash at 8% — the pill-toggle track, the
          // outline-button hover fill, and the hero social-pill hover all use it.
          // Named because it recurs; the pill-track BORDER is border.subtle
          // (#56c4da24 = rgba(86,196,218,.14)), already a token.
          wash: { value: "rgba(86,196,218,.08)" },
        },
        warm: {
          solid: { value: "#f2b544" },
          // Amber button hover.
          emphasis: { value: "#ffca63" },
          // Ink for text sitting ON warm.solid.
          contrast: { value: "#231701" },
        },
        // NOTE: `fg` is NOT here. v3's key is uppercase DEFAULT, so a plain
        // `fg: { default }` registers `colors.fg.default` — a *different*,
        // unreferenced token — and leaves `colors.fg` on v3's black. See
        // semanticTokens below.
      },
      // v3 dropped the container.* sizes scale; re-added with the v2 values so
      // the maxW="container.*" call sites keep their caps.
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
          // The redesign's band shell. All seven design bands (header, hero,
          // about, skills, work, contact, footer) cap at this width.
          page: { value: "1160px" },
        },
      },
      // Self-hosted font families via CSS vars (see _app.tsx / @fontsource).
      fonts: {
        heading: { value: "var(--font-tw)" },
        body: { value: "var(--font-mulish)" },
        // Redesign: kickers, tags, sha labels, and the commit motif.
        mono: { value: "var(--font-mono)" },
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
        // The redesign's rhythm unit: a 25px baseline = the Body line box.
        // Every vertical measure resolves to a whole (or half) multiple, so text
        // across columns locks to one grid. Referenced as gap="line.1" etc.
        //
        // NOTE this is a BASELINE, not an 8px grid — 25px is not a multiple of 8.
        // Headings are deliberately NOT locked to it: their font-size clamps ramp
        // ~1.7x faster than Body's, so a fixed multiple would force sub-1.0
        // line-heights on display type. Headings are optical; blocks are on-grid.
        line: {
          half: { value: "0.78125rem" }, // 12.5px · dense component gaps
          "1": { value: "1.5625rem" }, //   25px · base unit / block gap
          "2": { value: "3.125rem" }, //    50px · card padding
          "3": { value: "4.6875rem" }, //   75px · sub-section spacing
          "4": { value: "6.25rem" }, //    100px · section padding
          "5": { value: "7.8125rem" }, //  125px · major separation
        },
        // DEPRECATED — the v2-era 19px grid (1-8 x 1.188rem). Superseded by
        // `line.*` above. Still referenced by un-redesigned sections; the
        // redesign sweep PR retires it once every section has migrated.
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
    // These three names are already owned by v3's defaultConfig as
    // semanticTokens. Declared as plain tokens they emit at
    // `&:where(html, .chakra-theme)` — zero specificity — while v3's default
    // emits at `:root &, .light &` (0,1,0). `:root` matches unconditionally, so
    // v3's gray wins and the design colour is dead, typechecking clean the whole
    // way. Declaring them here replaces the defaults at config-merge time and
    // emits a single declaration. Safe from the `base`-is-a-condition-key trap:
    // each takes a flat value, not a `.base` sub-key.
    semanticTokens: {
      colors: {
        // DEFAULT registers the BARE name (`colors.fg`), which is what v3's own
        // globalCss html rule and ~15 default recipes reference. Lowercase
        // `default` does NOT — that was the #22 bug: it minted colors.fg.default
        // (referenced nowhere) while colors.fg stayed v3's _light black.
        // Unlike `base`, DEFAULT does not collapse its siblings.
        fg: {
          DEFAULT: { value: "#eaf3f2" },
          muted: { value: "#a9bab9" },
          subtle: { value: "#7a9ea0" },
        },
        // v3's `bg` is _light white. It backs v3's default html{bg:"bg"}, so
        // deleting our html rule below would paint the canvas WHITE, not nothing.
        bg: {
          DEFAULT: { value: "#0b1617" },
        },
        border: {
          subtle: { value: "#56c4da24" },
        },
      },
    },
    recipes: {
      heading: headingRecipe,
      button: buttonRecipe,
      link: linkRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);

export default system;
