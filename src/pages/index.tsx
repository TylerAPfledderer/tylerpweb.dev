import { AboutMeSection } from "@/components/AboutMeSection";
import { HeroSection } from "@/components/HeroSection";
import { MainSection } from "@/components/MainSection";
import { SkillsSection } from "@/components/SkillsSection";
import { Box, Center, Text } from "@chakra-ui/react";

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
      </Box>
    </>
  );
}
