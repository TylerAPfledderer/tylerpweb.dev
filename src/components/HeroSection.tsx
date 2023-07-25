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

export const HeroSection = () => (
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
            Hi, I&apos;m Tyler!
          </Heading>
          <Text as="span" fontSize={["md", null, "lg"]}>
            UI / UX Developer
          </Text>
        </VStack>
        <Box maxW="md">
          <Text>
            Passionate about all things accessibility, user experience, and UI
            design to code.
          </Text>
          <Text>
            Curious about typography and why building emails is so dang
            difficult!
          </Text>
        </Box>
        <Button as={Link} href="#projects-contributions">
          Projects &amp; Contributions
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
      <Text fontSize="sm">What am I up to?</Text>
      <CurvedDownArrow />
    </VStack>
  </MainSection>
);
