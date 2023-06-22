import { socialMediaLinks } from "@/data";
import { CurvedDownArrow } from "@/svg-icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Img,
  Link,
  List,
  ListItem,
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
      <main>
        {/* Hero Section */}
        <VStack spacing={20} px={8} py={12}>
          <Flex
            flexDir={{ base: "column", lg: "row" }}
            columnGap={8}
            rowGap={16}
            justifyContent="space-between"
            align="center"
            w="full"
            maxW="container.lg"
          >
            <VStack spacing="text.base" textAlign="center">
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
                  Passionate about all things accessibility, user experience,
                  and UI design to code.
                </Text>
                <Text>
                  Curious about typography and why building emails is so dang
                  difficult!
                </Text>
              </Box>
              <Button as={Link} href="#projects-contributions" fontSize="sm">
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
        </VStack>
      </main>
    </>
  );
}
