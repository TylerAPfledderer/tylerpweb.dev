import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Trans, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Box, Center, Flex, Text, Separator } from "@chakra-ui/react";
import { AboutMeSection } from "@/components/AboutMeSection";
import { HeroSection } from "@/components/HeroSection";
import { MainSection } from "@/components/MainSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ReachOutSection } from "@/components/ReachOutSection";
import { SkillsSection } from "@/components/SkillsSection";

export default function Home(
  _props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { t } = useTranslation();
  return (
    <>
      <Center as="header">
        <Box maxW="8xl" w="full" px="8" py="6">
          <Text as="span" fontFamily="heading" fontSize="xl">
            TP
          </Text>
        </Box>
      </Center>
      <Box as="main" textAlign="center">
        <HeroSection />
        <AboutMeSection />
        <MainSection
          py={{ base: "12", lg: "36" }}
          px={{ base: "4" }}
          gap={{ base: "20", lg: "36" }}
        >
          <SkillsSection />
          <Separator
            borderStyle="solid"
            borderColor="primary.dark"
            maxW="container.xl"
          />
          <ProjectsSection />
        </MainSection>
        <ReachOutSection />
      </Box>
      <Flex
        as="footer"
        px={{ base: "4", md: "16" }}
        py={{ base: "4", md: "8" }}
        direction={{ base: "column", lg: "row" }}
        fontSize="sm"
        textAlign="center"
        align="center"
        justify={{ lg: "space-between" }}
        gap="text.sm"
      >
        <Text as="span">
          <Trans
            i18nKey="footer-copyright"
            values={{ date: new Date().getFullYear() }}
          />
        </Text>
        <Text as="span">{t("footer-desc")}</Text>
      </Flex>
    </>
  );
}

export const getStaticProps: GetStaticProps<
  Awaited<ReturnType<typeof serverSideTranslations>>
> = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        "open-source-data",
        "projects-item-data",
      ])),
    },
  };
};
