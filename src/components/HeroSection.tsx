import { socialMediaLinks } from "@/data";
import {
  Flex,
  VStack,
  Heading,
  Button,
  Img,
  List,
  ListItem,
  Icon,
  Text,
  Box,
  Link,
  keyframes,
} from "@chakra-ui/react";
import { CurvedDownArrow } from "../lib/icons/CurvedDownArrow";
import { MainSection } from "./MainSection";

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
    <Flex
      as={List}
      aria-label="social media"
      justify="center"
      flexWrap={{ sm: "wrap" }}
      flexDir={["column", "row"]}
      gap={8}
    >
      {socialMediaLinks.map(({ href, icon, label, platform }) => (
        <ListItem key={label}>
          <Flex
            as={Link}
            href={href}
            flexDir="column"
            fontSize="sm"
            align="center"
            target="_blank"
            aria-label={`My ${platform}`}
            _hover={{
              svg: {
                color: "#E00400",
                animation: `${waggle} forwards .5s`,
              },
            }}
          >
            <Icon as={icon} display="block" fontSize="lg" />
            {label}
          </Flex>
        </ListItem>
      ))}
    </Flex>
    <VStack>
      <Text fontSize="sm">What am I up to?</Text>
      <CurvedDownArrow />
    </VStack>
  </MainSection>
);
