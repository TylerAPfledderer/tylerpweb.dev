import { Flex, Heading, Text, VStack, chakra } from "@chakra-ui/react";
import { Trans, useTranslation } from "next-i18next";

// The design's two About cards (Portfolio.dc.html §about). Each is a gradient
// surface with a hairline border; the second swaps the teal wash for amber. The
// body copy colour (#c6d5d4) is one of the design's unnamed greys — raw until
// that ramp is settled in the DS, matching the Work cards' treatment.
//
// The shared card shell as a styled component; the per-card gradient + border
// stay as instance props since they differ (teal vs amber).
const InfoCard = chakra("div", {
  base: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "4",
    rounded: "20px",
    p: "clamp(28px, 6vw, 38px)",
    borderWidth: "1px",
  },
});

export const AboutMeSection = () => {
  const { t } = useTranslation();

  return (
    // Full-bleed band, same shell as the Work section. The legacy primary.base
    // slab + skewed ::before are gone: the design replaces both with a flat
    // bg.band (#122527), where fg (#eaf3f2) is 16.30:1 and axe can measure it —
    // so the old hand-pinned color="body" contrast pin is retired here too.
    <chakra.section
      id="about"
      display="flex"
      w="full"
      bg="bg.band"
      borderYWidth="1px"
      borderColor="border.subtle"
      textAlign="start"
    >
      <VStack
        w="full"
        maxW="container.page"
        mx="auto"
        px="clamp(20px, 5vw, 32px)"
        py="clamp(64px, 12vw, 120px)"
        gap="clamp(36px, 6vw, 52px)"
        align="stretch"
      >
        <VStack gap="5" align="start">
          <Text textStyle="mono" color="accent.emphasis">
            {t("about-kicker")}
          </Text>
          <Heading textStyle="h2" maxW="20ch" asChild>
            <h2>
              <Trans
                i18nKey="about-title"
                components={[
                  <chakra.span key={0} color="accent.emphasis" />,
                  <chakra.span key={1} color="warm.solid" />,
                ]}
              />
            </h2>
          </Heading>
        </VStack>
        <Flex wrap="wrap" gap="6">
          <InfoCard
            bgGradient="to-br"
            gradientFrom="rgba(51,166,192,.1)"
            gradientTo="rgba(51,166,192,.03)"
            borderColor="border.subtle"
          >
            <Heading as="h3" textStyle="h3">
              {t("about-card-code-title")}
            </Heading>
            <Text color="#c6d5d4">{t("about-card-code-desc")}</Text>
          </InfoCard>
          <InfoCard
            bgGradient="to-br"
            gradientFrom="rgba(242,181,68,.09)"
            gradientTo="rgba(242,181,68,.02)"
            borderColor="rgba(242,181,68,.18)"
          >
            <Heading as="h3" textStyle="h3">
              {t("about-card-origin-title")}
            </Heading>
            <Text color="#c6d5d4">{t("about-card-origin-desc")}</Text>
          </InfoCard>
        </Flex>
      </VStack>
    </chakra.section>
  );
};
