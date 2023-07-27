import { Image } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { ProjectDataItem } from "./utils";

export interface ProjectItemCardProps extends ProjectDataItem {}

export const ProjectItemCard = (
  props: ProjectItemCardProps & { idx: number }
) => {
  const {
    demoUrl,
    description,
    githubSlug,
    image,
    projectName,
    stackTags,
    idx,
  } = props;

  const { t } = useTranslation("projects-item-data");

  const imgObjPosition = useBreakpointValue({
    base: "top center",
    lg: "top left",
  });

  const isOddIndex = idx % 2 === 0;

  return (
    <Stack
      spacing={0}
      direction={{
        base: "column",
        lg: idx % 2 === 0 ? "row" : "row-reverse",
      }}
      width="full"
      borderRadius="md"
      overflow="hidden"
      maxW={{ base: "md", md: "xl", lg: "full" }}
    >
      <Box
        flex={{ lg: "2" }}
        width="full"
        height={{ base: "52", md: "64", lg: "auto" }}
        position="relative"
        overflow="hidden"
      >
        <Image
          src={image}
          alt=""
          fill
          objectFit="cover"
          objectPosition={imgObjPosition}
        />
      </Box>
      <VStack
        flex={{ lg: "3" }}
        py={{ base: "4", lg: "16" }}
        px={{ base: "4", lg: "12" }}
        spacing="5"
        border="1px"
        borderColor="white"
        borderTop={{ base: "none", lg: "1px" }}
        borderRadius="inherit"
        borderBottomRadius={{ lg: "none" }}
        borderTopRadius="none"
        {...{
          [isOddIndex ? "borderLeft" : "borderRight"]: { lg: "none" },
          [isOddIndex ? "borderTopRightRadius" : "borderTopLeftRadius"]: {
            base: "none",
            lg: "inherit",
          },
          [isOddIndex ? "borderBottomRightRadius" : "borderBottomLeftRadius"]: {
            lg: "inherit",
          },
        }}
      >
        <HStack as={List} spacing="4">
          {stackTags.map((Tag, idx) => (
            <ListItem key={idx}>
              <Tag w="8" h="auto" />
            </ListItem>
          ))}
        </HStack>
        <VStack spacing="text.sm" maxW="xl">
          <Heading as="h3" size="2xl">
            {t(projectName)}
          </Heading>
          <Text>{t(description)}</Text>
        </VStack>
        <HStack wrap="wrap" justify="center">
          <Button
            as={Link}
            href={`https://github.com/tylerapfledderer/${githubSlug}`}
            isExternal
          >
            {t("project-item-card-github")}
          </Button>
          <Button as={Link} variant="outline" href={demoUrl} isExternal>
            {t("project-item-card-demo")}
          </Button>
        </HStack>
      </VStack>
    </Stack>
  );
};
