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
import { Key } from "react";

export interface ProjectItemCardProps {
  image: string;
  stackTags: Array<typeof Icon>;
  projectName: string;
  description: string;
  githubSlug: string;
  demoUrl: string;
}

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
        maxW="xl"
      >
        <HStack as={List} spacing="4">
          {stackTags.map((Tag, idx) => (
            <ListItem key={idx}>
              <Tag w="8" h="auto" />
            </ListItem>
          ))}
        </HStack>
        <VStack spacing="text.sm">
          <Heading as="h3" size="2xl">
            {projectName}
          </Heading>
          <Text>{description}</Text>
        </VStack>
        <HStack wrap="wrap" justify="center">
          <Button
            as={Link}
            href={`https://github.com/tylerapfledderer/${githubSlug}`}
            isExternal
          >
            Github Source
          </Button>
          <Button as={Link} variant="outline" href={demoUrl} isExternal>
            Demo Site
          </Button>
        </HStack>
      </VStack>
    </Stack>
  );
};
