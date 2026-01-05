import {
  Box,
  Button,
  Center,
  Heading,
  List,
  VStack,
  Tabs,
  chakra,
} from "@chakra-ui/react";
import { Children } from "react";
import { OpenSourceItemCard } from "./OpenSourceItemCard";
import { openSourceData, projectsData } from "./utils";
import { ProjectItemCard } from "./ProjectItemCard";
import { Trans, useTranslation } from "next-i18next";

export const ProjectsSection = () => {
  const { t } = useTranslation();
  return (
    <VStack gap={{ base: "16", lg: "24" }} w="full">
      <Heading id="projects-contributions">{t("projects-title")}</Heading>
      <Tabs.Root
        variant="enclosed"
        w="full"
        fontSize="sm"
        maxW="container.xl"
        lazyMount
        defaultValue="open-source"
      >
        <Tabs.List>
          <Tabs.Trigger
            value="open-source"
            borderTopRadius="md"
            fontSize="sm"
            py="3"
            lineHeight="100%"
            _selected={{
              bg: "white",
              color: "primary.base",
            }}
          >
            <Trans
              i18nKey="projects-tab-open-source"
              components={[<chakra.span key="0" hideBelow="sm" />]}
            />
          </Tabs.Trigger>
          <Tabs.Trigger
            value="projects"
            borderTopRadius="md"
            fontSize="sm"
            py="3"
            lineHeight="100%"
            _selected={{
              bg: "white",
              color: "primary.base",
            }}
          >
            {t("projects-tab-projects")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="open-source" p={0} pt="16">
          <List.Root as={VStack} gap="16" aria-label="Open Source Contributions">
            {openSourceData.map((data, idx) => (
              <Center as={List.Item} key={idx} w="full">
                <OpenSourceItemCard {...data} />
              </Center>
            ))}
          </List.Root>
        </Tabs.Content>
        <Tabs.Content value="projects" p={0} pt="16">
          <List.Root as={VStack} gap="16" aria-label="Personal Projects">
            {projectsData.map((data, idx) => (
              <Center as={List.Item} key={idx} w="full">
                <ProjectItemCard idx={idx} {...data} />
              </Center>
            ))}
          </List.Root>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
