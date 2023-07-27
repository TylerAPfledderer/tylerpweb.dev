import { Box, Center, Divider, Flex, Text } from "@chakra-ui/react";
import { AboutMeSection } from "@/components/AboutMeSection";
import { HeroSection } from "@/components/HeroSection";
import { MainSection } from "@/components/MainSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ReachOutSection } from "@/components/ReachOutSection";
import { SkillsSection } from "@/components/SkillsSection";

export default function Home() {
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
          spacing={{ base: "20", lg: "36" }}
        >
          <SkillsSection />
          <Divider
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
          Copyright {new Date().getFullYear()} Tyler Pfledderer
        </Text>
        <Text as="span">
          This site is built with NextJS, TypeScript, and Chakra UI
        </Text>
      </Flex>
    </>
  );
}
