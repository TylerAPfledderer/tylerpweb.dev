import { useTranslation } from "next-i18next";
import {
  Flex,
  VStack,
  Heading,
  Button,
  Img,
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
    <MainSection spacing={20}>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        columnGap={8}
        rowGap={16}
        justifyContent="space-between"
        align="center"
        w="full"
        maxW="container.lg"
      >
        <VStack spacing="text.base">
          <VStack spacing={{ sm: "text.sm" }}>
            <Heading as="h1" size="4xl">
              {t("hero-site-title")}
            </Heading>
            <Text as="span" fontSize={["md", null, "lg"]}>
              {t("hero-site-subtitle")}
            </Text>
          </VStack>
          <Box maxW="md">
            <Text>{t("hero-desc-1")}</Text>
            <Text>{t("hero-desc-2")}</Text>
          </Box>
          <Button as={Link} href="#projects-contributions">
            {t("hero-cta")}
          </Button>
        </VStack>
        <Img
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
