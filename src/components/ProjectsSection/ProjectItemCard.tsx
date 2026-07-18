import NextImage from "next/image";
import {
  Box,
  Button,
  HStack,
  Heading,
  Link,
  List,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ProjectDataItem } from "./utils";

export interface ProjectItemCardProps extends ProjectDataItem {}

export const ProjectItemCard = (props: ProjectItemCardProps) => {
  const { demoUrl, description, githubSlug, image, projectName, stackTags } =
    props;

  const { t } = useTranslation("projects-item-data");

  return (
    // Grid card. The container grid sizes the cell; the card fills it, stacks
    // vertically, and clips the screenshot to the rounded top. The real
    // screenshot is kept (design showed a placeholder) — next/image `fill`.
    <VStack
      w="full"
      align="stretch"
      gap="0"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="rgba(86,196,218,.14)"
      borderRadius="20px"
      overflow="hidden"
      textAlign="start"
    >
      <Box
        position="relative"
        w="full"
        aspectRatio="16 / 10"
        borderBottomWidth="1px"
        borderColor="rgba(86,196,218,.12)"
      >
        <NextImage
          src={image}
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "top center" }}
        />
      </Box>
      <VStack flex="1" align="start" gap="4" px="6" pt="6" pb="7">
        <VStack flex="1" align="start" gap="4">
          <Heading as="h3" textStyle="h3">
            {t(projectName)}
          </Heading>
          <Text fontSize="sm" color="fg.muted">
            {t(description)}
          </Text>
        </VStack>
        <HStack asChild gap="1.5" wrap="wrap">
          <List.Root listStyleType="none">
            {stackTags.map((tag) => (
              <List.Item key={tag}>
                <Text
                  textStyle="mono"
                  fontSize="0.6875rem"
                  color="accent.muted"
                  bg="rgba(86,196,218,.09)"
                  px="2.5"
                  py="1"
                  borderRadius="6px"
                >
                  {tag}
                </Text>
              </List.Item>
            ))}
          </List.Root>
        </HStack>
        <HStack gap="2.5" w="full">
          <Button asChild variant="outline" size="sm" borderRadius="10px" flex="1">
            <Link
              href={`https://github.com/tylerapfledderer/${githubSlug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("project-item-card-source")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" borderRadius="10px" flex="1">
            <Link href={demoUrl} target="_blank" rel="noopener noreferrer">
              {t("project-item-card-demo")}
            </Link>
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};
