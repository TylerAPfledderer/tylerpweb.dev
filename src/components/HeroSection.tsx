import { useTranslation } from "next-i18next";
import {
  Flex,
  VStack,
  Heading,
  Button,
  Image,
  Text,
  Box,
  Link,
} from "@chakra-ui/react";
import { CurvedDownArrow } from "../lib/icons/CurvedDownArrow";
import { MainSection } from "./MainSection";
import { SocialLinksList } from "./SocialLinksList";

export const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <MainSection id="top" gap={20}>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        columnGap={8}
        rowGap={16}
        justifyContent="space-between"
        align="center"
        w="full"
        maxW="container.lg"
      >
        <VStack gap="text.base">
          <VStack gap={{ sm: "text.sm" }}>
            <Heading as="h1" size="4xl">
              {t("hero-site-title")}
            </Heading>
            {/* Object syntax, not the array form this used to use. Array indices
                map to the SORTED breakpoint list, so adding `nav` (640px) to the
                theme silently moved index 2 from md (768px) to nav (640px) — the
                lg size would have kicked in 128px early. Named keys cannot shift. */}
            <Text as="span" fontSize={{ base: "md", md: "lg" }}>
              {t("hero-site-subtitle")}
            </Text>
          </VStack>
          <Box maxW="md">
            <Text>{t("hero-desc-1")}</Text>
            <Text>{t("hero-desc-2")}</Text>
          </Box>
          <Button asChild>
            <Link href="#work">{t("hero-cta")}</Link>
          </Button>
        </VStack>
        <Image
          src="/static/version-control.svg"
          alt=""
          flex={1}
          maxW="418px"
          w="full"
          hideBelow="md"
        />
      </Flex>
      <SocialLinksList />
      <VStack>
        <Text fontSize="sm">{t("hero-page-scroll-notice")}</Text>
        <CurvedDownArrow />
      </VStack>
    </MainSection>
  );
};
