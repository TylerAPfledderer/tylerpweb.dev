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
import { useTranslation } from "next-i18next";
import { OpenSourceDataItem } from "./utils";

interface OpenSourceItemCardProps extends OpenSourceDataItem {}

export const OpenSourceItemCard = (props: OpenSourceItemCardProps) => {
  const {
    icon: Icon,
    title,
    role,
    description,
    contributionUrl,
    projectGithub,
  } = props;

  const { t } = useTranslation("open-source-data");

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
            {t(role)}
          </Text>
        </VStack>
        <Box maxW="prose">
          {description.map((paragraph, idx) => (
            <Text key={idx}>{t(paragraph)}</Text>
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
            {t("open-source-card-contributions")}
          </Button>
          <Button as={Link} href={projectGithub} variant="outline" isExternal>
            {t("open-source-card-project")}
          </Button>
        </Stack>
      </VStack>
    </VStack>
  );
};
