import {
  Heading,
  Highlight,
  Stack,
  Text,
  VStack,
  calc,
  useToken,
} from "@chakra-ui/react";
import { MainSection } from "./MainSection";

export const AboutMeSection = () => {
  const size28 = useToken("sizes", 28);
  return (
    <MainSection
      bg="primary.base"
      spacing={{ base: 16, lg: 36 }}
      position="relative"
      _before={{
        content: { lg: `""` },
        bg: "inherit",
        display: "block",
        position: "absolute",
        zIndex: -1,
        top: -14,
        h: calc("100%").add(size28).toString(),
        w: "100vw",
        transform: "skewY(1deg)",
        boxShadow: `inset 0px -30px 20px -18px rgba(0, 0, 0, 0.2) , 
          0px -30px 20px -18px rgba(0, 0, 0, 0.2)`,
      }}
    >
      <VStack spacing="text.base" maxWidth="prose">
        <Heading>
          <Highlight
            query={["beautiful", "useable"]}
            styles={{ color: "secondary.base" }}
          >
            I make sites beautiful and useable
          </Highlight>
        </Heading>
        <Text>
          I have focus in bringing designs to life in code, and finding ways to
          further improve the user experience.{" "}
          <Text as="span" color="secondary.base" fontWeight="bold">
            I am currently a collaborator with Chakra UI
          </Text>
          , helping to improve a low-level design system component library that
          focuses on A11y for React and Vue. Open source is my jam! 🤘
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "text.sm", lg: 28 }}
        align="center"
        justify="space-between"
      >
        <Heading as="h3" size="2xl" flex={1} maxW={{ lg: 72 }}>
          Where did I come from?
        </Heading>
        <Text maxW="prose" flex={2}>
          I am a classically-trained musician of over 15 years 🎺 striving for a
          career change into web development. My skills in music involve
          critically-thinking, problem solving, and adaptability which provide a
          high-quality transposition into gaining speed on a project or a team,
          in any stack that is required. Supply the tools and I will adapt!
        </Text>
      </Stack>
    </MainSection>
  );
};
