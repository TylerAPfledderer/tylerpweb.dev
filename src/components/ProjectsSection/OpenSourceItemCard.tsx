import {
  Box,
  Button,
  HStack,
  Heading,
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
    // Gradient surface card. flex sizing (1 1 300px) is supplied by the container
    // grid; the card just fills its cell and stretches full height so the action
    // row can pin to the bottom (mt="auto") across a wrapped row.
    <VStack
      w="full"
      align="start"
      gap="5"
      bgGradient="to-b"
      gradientFrom="rgba(51,166,192,.09)"
      gradientTo="rgba(51,166,192,.03)"
      borderWidth="1px"
      borderColor="rgba(86,196,218,.16)"
      borderRadius="22px"
      p="clamp(28px, 6vw, 38px)"
      textAlign="start"
    >
      <HStack gap="4" align="center">
        <Icon w="auto" height="12" flex="none" />
        <VStack gap="0.5" align="start" minW="0">
          <Heading as="h3" textStyle="h3">
            {title}
          </Heading>
          <Text as="span" textStyle="mono" color="warm.solid">
            {t(role)}
          </Text>
        </VStack>
      </HStack>
      <Box>
        {description.map((paragraph, idx) => (
          <Text key={idx}>{t(paragraph)}</Text>
        ))}
      </Box>
      <Stack direction="row" gap="3" wrap="wrap" mt="auto" pt="1">
        <Button asChild variant="solidTeal" size="sm" borderRadius="11px">
          <Link href={contributionUrl} target="_blank" rel="noopener noreferrer">
            {t("open-source-card-contributions")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" borderRadius="11px">
          <Link href={projectGithub} target="_blank" rel="noopener noreferrer">
            {t("open-source-card-project")}
          </Link>
        </Button>
      </Stack>
    </VStack>
  );
};
