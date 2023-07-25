import {
  Box,
  Button,
  Center,
  Heading,
  List,
  ListItem,
  TabList,
  TabPanelProps,
  TabPanels,
  Tabs,
  VStack,
  chakra,
  forwardRef,
  useMultiStyleConfig,
  useTab,
  useTabPanel,
} from "@chakra-ui/react";
import { Children } from "react";
import { OpenSourceItemCard } from "./OpenSourceItemCard";
import { openSourceData, projectsData } from "./utils";
import { ProjectItemCard, ProjectItemCardProps } from "./ProjectItemCard";

const CustomTab = forwardRef((props, ref) => {
  const { children, ...tabProps } = useTab({ ...props, ref });
  const styles = useMultiStyleConfig("Tabs", {
    ...tabProps,
    variant: "unstyled",
  });

  return (
    <Button
      __css={styles.tab}
      {...tabProps}
      borderTopRadius="md"
      fontSize="sm"
      py="3"
      lineHeight="100%"
      _selected={{
        bg: "white",
        color: "primary.base",
      }}
    >
      {children}
    </Button>
  );
});

const CustomPanel = forwardRef<TabPanelProps & { listLabel: string }, "div">(
  (props, ref) => {
    const { listLabel, ...rest } = props;
    const { children, ...panelProps } = useTabPanel({ ref, ...rest });

    return (
      <Box {...panelProps} p={0} pt="16">
        <VStack as={List} spacing="16" aria-label={listLabel}>
          {Children.toArray(children).map((child, idx) => (
            <Center as={ListItem} key={idx} w="full">
              {child}
            </Center>
          ))}
        </VStack>
      </Box>
    );
  }
);

export const ProjectsSection = () => {
  return (
    <VStack spacing={{ base: "16", lg: "24" }} w="full">
      <Heading id="projects-contributions">
        Projects &amp; Contributions
      </Heading>
      <Tabs
        variant="enclosed-colored"
        w="full"
        fontSize="sm"
        maxW="container.lg"
        isLazy
      >
        <TabList>
          <CustomTab>
            Open Source <chakra.span hideBelow="sm">Contributions</chakra.span>
          </CustomTab>
          <CustomTab>Projects</CustomTab>
        </TabList>
        <TabPanels>
          <CustomPanel listLabel="Open Source Contributions">
            {openSourceData.map((data, idx) => (
              <OpenSourceItemCard key={idx} {...data} />
            ))}
          </CustomPanel>
          <CustomPanel listLabel="Personal Projects">
            {projectsData.map((data, idx) => (
              <ProjectItemCard key={idx} idx={idx} {...data} />
            ))}
          </CustomPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
