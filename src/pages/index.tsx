import { AboutMeSection } from "@/components/AboutMeSection";
import { HeroSection } from "@/components/HeroSection";
import { MainSection } from "@/components/MainSection";
import { socialMediaLinks } from "@/data";
import { CurvedDownArrow } from "@/svg-icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Highlight,
  Icon,
  Img,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  VStack,
  keyframes,
} from "@chakra-ui/react";

const waggle = keyframes({
  "10%": {
    transform: "scale(0.8) rotate(-20deg)",
  },
  "40%": {
    transform: "scale(1.9) rotate(10deg)",
  },
  "60%": {
    transform: "scale(1.6) rotate(-10deg)",
  },
  "100%": {
    transform: "scale(1.4)",
  },
});

export default function Home() {
  return (
    <>
      <Center as="header">
        <Box maxW="8xl" w="full" px={8} py={6}>
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
