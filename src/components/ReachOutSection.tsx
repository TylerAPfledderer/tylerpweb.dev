import { Button, Flex, Heading, Text, VStack, chakra } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

// The design's contact CTA card (Portfolio.dc.html §contact). A teal gradient
// panel on the dark canvas, with a radial glow overlay in the top-right. The
// glow is a decorative ::before so it can sit behind the content without a
// stacking-context fight; overflow:hidden clips it to the rounded card.
const ContactCard = chakra("div", {
  base: {
    flex: "1",
    display: "flex",
    position: "relative",
    overflow: "hidden",
    rounded: "28px",
    borderWidth: "1px",
    borderColor: "rgba(86,196,218,.22)",
    bgGradient: "to-br",
    gradientFrom: "#12525e",
    gradientTo: "#0e3038",
    p: {
      base: "clamp(44px, 9vw, 72px) clamp(24px, 6vw, 56px)",
      md: "72px 56px",
    },
    _before: {
      content: '""',
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      // The design anchors the glow at 80% 0% with a 520x320 falloff — a
      // positioned radial that bgGradient's keyword shorthand can't express, so
      // it's a raw backgroundImage.
      bgImage:
        "radial-gradient(520px 320px at 80% 0%, rgba(86,196,218,.22), transparent 60%)",
    },
  },
});

// White-outline social buttons — the design's contact-card treatment, distinct
// from the teal `outline` recipe (borders are white-alpha here, on the teal
// panel). Single consumer, so kept local per the theme.ts recipe-scoping note.
const socialButtonStyles = {
  variant: "outline",
  borderColor: "rgba(255,255,255,.28)",
  color: "#eefaf9",
  fontWeight: "600",
  _hover: { borderColor: "#fff", bg: "rgba(255,255,255,.08)" },
} as const;

export const ReachOutSection = () => {
  const { t } = useTranslation();
  return (
    // Full-bleed dark band. The legacy primary.base slab + its 4.29:1 color="body"
    // pin are gone: the canvas is bg.canvas (#0b1617) where fg (#eaf3f2) is
    // 16.30:1, and the teal now lives inside the gradient card below.
    <Flex as="section" id="contact" w="full" bg="bg.canvas" textAlign="start">
      <Flex
        w="full"
        maxW="container.page"
        mx="auto"
        px="clamp(20px, 5vw, 32px)"
        py="clamp(64px, 12vw, 120px)"
      >
        <ContactCard>
          <VStack position="relative" flex="1" align="center" gap="9">
            <VStack align="center" gap="4">
              <Heading textStyle="h2" color="#eefaf9" textAlign="center">
                {t("reach-out-title")}
              </Heading>
              <Text
                textStyle="lead"
                color="#cfe4e3"
                maxW="52ch"
                textAlign="center"
              >
                {t("reach-out-desc")}
              </Text>
            </VStack>
            <Flex wrap="wrap" gap="3" justify="center" align="center">
              <Button asChild variant="solid">
                <a href="mailto:tyler.pfledderer@gmail.com">
                  tyler.pfledderer@gmail.com
                </a>
              </Button>
              <Flex gap="3" flex="none">
                <Button asChild {...socialButtonStyles}>
                  <a
                    href="https://linkedin.com/in/tyler-pfledderer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
                <Button asChild {...socialButtonStyles}>
                  <a
                    href="https://github.com/tylerapfledderer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </Button>
              </Flex>
            </Flex>
          </VStack>
        </ContactCard>
      </Flex>
    </Flex>
  );
};
