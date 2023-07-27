import { Heading, Text, VStack } from "@chakra-ui/react";
import { MainSection } from "./MainSection";
import { SocialLinksList } from "./SocialLinksList";
import { useTranslation } from "next-i18next";

export const ReachOutSection = () => {
  const { t } = useTranslation();
  return (
    <MainSection bg="primary.base" spacing="16" px="4">
      <VStack spacing="text.base" maxW="xl">
        <Heading>{t("reach-out-title")}</Heading>
        <Text>{t("reach-out-desc")}</Text>
      </VStack>
      <SocialLinksList />
    </MainSection>
  );
};
