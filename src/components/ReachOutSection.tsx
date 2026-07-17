import { Heading, Text, VStack } from "@chakra-ui/react";
import { MainSection } from "./MainSection";
import { SocialLinksList } from "./SocialLinksList";
import { useTranslation } from "next-i18next";

export const ReachOutSection = () => {
  const { t } = useTranslation();
  return (
    // TRANSITIONAL: pins the text back to white. globalCss now defaults body to
    // fg (#eaf3f2), but this section still paints the LEGACY teal slab
    // (primary.base #297b91), and #eaf3f2 on it is 4.29:1 — under AA. White is
    // 4.84:1, which is what shipped before and what this preserves exactly.
    //
    // A text colour and its backdrop are a PAIR. The redesign changes both: this
    // band becomes bg.canvas, where #eaf3f2 is 16.30:1. Delete this pin in the
    // Contact section PR, together with bg="primary.base".
    <MainSection id="contact" bg="primary.base" color="body" gap="16" px="4">
      <VStack gap="text.base" maxW="xl">
        <Heading>{t("reach-out-title")}</Heading>
        <Text>{t("reach-out-desc")}</Text>
      </VStack>
      <SocialLinksList />
    </MainSection>
  );
};
