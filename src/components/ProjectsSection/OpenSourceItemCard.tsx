import {
  Box,
  Button,
  Heading,
  Icon,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

interface OpenSourceItemCardProps {
  icon: typeof Icon;
  title: string;
  role: string;
  description: string[];
  contributionUrl: string;
  projectGithub: string;
}

export const OpenSourceItemCard = (props: OpenSourceItemCardProps) => {
  const {
    icon: Icon,
    title,
    role,
    description,
    contributionUrl,
    projectGithub,
  } = props;

  return (
    <VStack
      border="1px"
      borderColor="body"
      borderRadius="xl"
      py="8"
      px={{ base: "4", md: "16" }}
      gap="4"
      w="full"
      maxW="container.md"
    >
      <Icon w="auto" height="24" />
      <VStack spacing="text.base">
        <VStack spacing={0}>
          <Heading as="h3" size="2xl">
            {title}
          </Heading>
          <Text as="span" fontSize="md">
            {role}
          </Text>
        </VStack>
        <Box maxW="prose">
          {description.map((paragraph, idx) => (
            <Text key={idx}>{paragraph}</Text>
          ))}
        </Box>
        <Stack
          direction="row"
          justify="center"
          gap="4"
          wrap="wrap"
          shouldWrapChildren
        >
          <Button as={Link} href={contributionUrl} isExternal>
            View My Contributions
          </Button>
          <Button as={Link} href={projectGithub} variant="outline" isExternal>
            View the Project
          </Button>
        </Stack>
      </VStack>
    </VStack>
  );
};
