import {
  Heading,
  Highlight,
  Stack,
  Text,
  VStack,
  useToken,
} from "@chakra-ui/react";
import { MainSection } from "./MainSection";
import { Trans, useTranslation } from "next-i18next";

export const AboutMeSection = () => {
  const { t } = useTranslation();

  const size28 = useToken("sizes", "28");
  const skewBackgroundStyles = {
    _before: {
      content: { lg: `""` },
      bg: "inherit",
      display: "block",
      position: "absolute",
      zIndex: -1,
      top: -14,
      h: `calc(100% + ${size28})`,
      w: "full",
      transform: "skewY(1deg)",
      boxShadow: `inset 0px -30px 20px -18px rgba(0, 0, 0, 0.2) ,
        0px -30px 20px -18px rgba(0, 0, 0, 0.2)`,
    },
  };
  return (
    // TRANSITIONAL: see the same pin in ReachOutSection. This band is the other
    // legacy primary.base (#297b91) slab, so body's new fg (#eaf3f2) would render
    // at 4.29:1 here — under AA. White is 4.84:1 and is what shipped before.
    //
    // VERIFIED, and worth knowing: axe does NOT flag this section, while it DOES
    // flag the identical 4.29:1 in ReachOutSection. Tested directly — dropping
    // this pin leaves the a11y run green. The only structural difference is the
    // skewed ::before below (position:relative + zIndex:-1 + an inset boxShadow),
    // which leaves the effective background undeterminable, so axe declines to
    // measure rather than reporting a violation.
    //
    // So the contrast here was never checked by anything. A green a11y run on
    // this section is the ABSENCE OF A MEASUREMENT, not the presence of a pass.
    //
    // Delete this pin in the About section PR, together with bg="primary.base"
    // and the skew (the design replaces both with a flat bg.band, where #eaf3f2
    // is 16.30:1 and axe can actually see it).
    <MainSection
      id="about"
      bg="primary.base"
      color="body"
      gap={{ base: 16, lg: 36 }}
      position="relative"
      {...skewBackgroundStyles}
    >
      <VStack gap="text.base" maxWidth="prose">
        <Heading>
          <Highlight
            query={[t("about-title-highlight-1"), t("about-title-highlight-2")]}
            styles={{ color: "secondary.base" }}
          >
            {t("about-title")}
          </Highlight>
        </Heading>
        <Text>
          <Trans
            i18nKey="about-main-description"
            components={[
              <Text
                as="span"
                key={0}
                color="secondary.base"
                fontWeight="bold"
              />,
            ]}
          />
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", lg: "row" }}
        gap={{ base: "text.sm", lg: 28 }}
        align="center"
        justify="space-between"
      >
        <Heading as="h3" size="2xl" flex={1} maxW={{ lg: 72 }}>
          {t("about-background")}
        </Heading>
        <Text maxW="prose" flex={2}>
          {t("about-background-desc")}
        </Text>
      </Stack>
    </MainSection>
  );
};
