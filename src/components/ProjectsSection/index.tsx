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
import { Trans, useTranslation } from "next-i18next";

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
  const { t } = useTranslation();
  return (
    <VStack spacing={{ base: "16", lg: "24" }} w="full">
      <Heading id="projects-contributions">{t("projects-title")}</Heading>
      <Tabs
        variant="enclosed-colored"
        w="full"
        fontSize="sm"
        maxW="container.xl"
        isLazy
      >
        <TabList>
          <CustomTab>
            <Trans
              i18nKey="projects-tab-open-source"
              components={[<chakra.span key="0" hideBelow="sm" />]}
            />
          </CustomTab>
          <CustomTab>{t("projects-tab-projects")}</CustomTab>
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
