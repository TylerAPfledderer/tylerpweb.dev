import { Heading, Text, VStack } from "@chakra-ui/react";
import { MainSection } from "./MainSection";
import { SocialLinksList } from "./SocialLinksList";

export const ReachOutSection = () => (
  <MainSection bg="primary.base" spacing="16" px="4">
    <VStack spacing="text.base" maxW="xl">
      <Heading>Reach Out!</Heading>
      <Text>
        I am actively seeking employment opportunities and would be delighted to
        discuss further. Feel free to reach out to me below, and I&apos;d be
        thrilled to contribute my skills to your team or assist in bringing your
        project to fruition!
      </Text>
    </VStack>
    <SocialLinksList />
  </MainSection>
);
