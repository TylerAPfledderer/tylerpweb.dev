import { Trans, useTranslation } from "next-i18next";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  List,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { socialMediaLinks } from "@/data";

// The design's hero social pill (Portfolio.dc.html §hero). A rounded outline
// chip in JetBrains mono. NOTE: fontFamily + fontSize are set DIRECTLY, not via
// textStyle="mono" — the mono textStyle is 13px/.24em/uppercase, but the pill is
// 12.5px, normal tracking, not uppercased. Local: single consumer.
const SocialPill = chakra("a", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    minH: "44px",
    px: "16px",
    py: "9px",
    rounded: "999px",
    borderWidth: "1px",
    borderColor: "rgba(86,196,218,.16)",
    color: "#b8c9c8",
    fontFamily: "mono",
    fontSize: "0.78125rem",
    whiteSpace: "nowrap",
    transition: "border-color .18s ease, color .18s ease",
    _hover: { borderColor: "accent.emphasis", color: "fg" },
  },
});

export const HeroSection = () => {
  const { t } = useTranslation();
  return (
    // Full-bleed hero band on the dark canvas. The two-layer glow is a RAW
    // bgImage — v3's bgGradient keyword shorthand cannot express a positioned
    // radial ("at 78% -10%"). The canvas (#0b1617) shows through the transparent
    // stops. Legacy MainSection + text.* spacing + the scroll notice are gone.
    <Flex
      as="section"
      id="top"
      w="full"
      bg="bg.canvas"
      bgImage="radial-gradient(1000px 560px at 78% -10%, rgba(51,166,192,.20), transparent 60%), radial-gradient(760px 520px at 8% 10%, rgba(51,166,192,.09), transparent 55%)"
      textAlign="start"
    >
      {/* Inner shell = the container. It carries containerType + containerName so
          the query reads ITS inline size; the column→row switch lives on a CHILD
          (the flex row below), never on this element itself — an element cannot
          respond to its own container query. Asymmetric padding (heavier bottom)
          per the design — pt/pb, NOT py.
          KNOWN OFFSET (see PLAN.md): container query fires ~64px later than the
          design's viewport @media 900px, because the container is viewport minus
          this padding. Left as a container query per Tyler; design issue to revisit. */}
      <Box
        w="full"
        maxW="container.page"
        mx="auto"
        px="clamp(20px, 5vw, 32px)"
        pt="clamp(64px, 12vw, 120px)"
        pb="clamp(72px, 13vw, 132px)"
        containerType="inline-size"
        containerName="hero"
      >
        <Flex
          direction="column"
          gap="12"
          _heroWide={{ flexDirection: "row", alignItems: "center", gap: "16" }}
          css={{
            animationName: "fadeup",
            animationDuration: ".7s",
            animationTimingFunction: "ease",
            animationFillMode: "both",
          }}
        >
          {/* Copy column */}
          <VStack flex="1.15" align="start" gap="9" minW="0">
            <VStack align="start" gap="5">
              <Text textStyle="mono" color="accent.emphasis">
                {t("hero-site-subtitle")}
              </Text>
              <Heading textStyle="display" asChild>
                <h1>
                  <Trans
                    i18nKey="hero-site-title"
                    components={[
                      <chakra.span key={0} color="accent.emphasis" />,
                    ]}
                  />
                </h1>
              </Heading>
              <VStack align="start" gap="4">
                <Text textStyle="lead" color="#c3d2d1" maxW="30ch">
                  {t("hero-desc-1")}
                </Text>
                <Text color="#a3b5b4" maxW="40ch">
                  {t("hero-desc-2")}
                </Text>
              </VStack>
            </VStack>
            <Flex wrap="wrap" gap="3.5">
              <Button asChild variant="solid">
                <a href="#work">{t("hero-cta")}</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#contact">{t("hero-cta-contact")}</a>
              </Button>
            </Flex>
            {/* flexDirection="row" is REQUIRED: v3's List.Root recipe hardcodes
                flexDirection:column, which wins through asChild and would stack
                the pills at every width (same trap as ProjectsSection's OSS list). */}
            <Flex asChild wrap="wrap" flexDirection="row" gap="2.5">
              <List.Root
                aria-label={t("hero-social-label")}
                listStyleType="none"
              >
                {socialMediaLinks.map(({ href, shortLabel, platform }) => (
                  <List.Item key={platform}>
                    <SocialPill
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`My ${platform}`}
                    >
                      {platform === "Email"
                        ? t("hero-social-email")
                        : shortLabel}
                    </SocialPill>
                  </List.Item>
                ))}
              </List.Root>
            </Flex>
          </VStack>

          {/* Graphic column — the static version-control motif for now; the design's
            animated branch-graph SVG is deferred to a follow-up. */}
          <Box
            flex=".85"
            w="full"
            maxW="340px"
            mx="auto"
            _heroWide={{ mx: "0", maxW: "none" }}
          >
            <Image
              src="/static/version-control.svg"
              alt=""
              w="full"
              hideBelow="md"
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
