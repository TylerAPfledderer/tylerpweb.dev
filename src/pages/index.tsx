import { AboutMeSection } from "@/components/AboutMeSection";
import { HeroSection } from "@/components/HeroSection";
import { MainSection } from "@/components/MainSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { Box, Center, Divider, Text } from "@chakra-ui/react";

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
      </Box>
    </>
  );
}
