import { Center, Heading, List, Tabs, VStack, chakra } from "@chakra-ui/react";
import { OpenSourceItemCard } from "./OpenSourceItemCard";
import { openSourceData, projectsData } from "./utils";
import { ProjectItemCard } from "./ProjectItemCard";
import { Trans, useTranslation } from "next-i18next";

// v3's `enclosed` recipe leaves the idle trigger on fg.muted and the list on bg.muted.
// Both are v3 default semanticTokens, and with no color mode their _light branch wins
// unconditionally (`:root &` matches everything) — so they render LIGHT surfaces on this
// dark site. Once the redesign gave fg.muted its dark-canvas value, the idle label landed
// on a gray-100 tablist at 1.84:1. Pin both ends to the design's own tokens rather than
// inherit v3's light defaults.
const triggerStyles = {
  borderTopRadius: "md",
  fontSize: "sm",
  py: "3",
  lineHeight: "100%",
  color: "fg.muted",
  _selected: {
    bg: "accent.solid",
    color: "bg.canvas",
  },
} as const;

export const ProjectsSection = () => {
  const { t } = useTranslation();
  return (
    <VStack gap={{ base: "16", lg: "24" }} w="full">
      <Heading id="projects-contributions">{t("projects-title")}</Heading>
      <Tabs.Root
        defaultValue="open-source"
        variant="enclosed"
        w="full"
        fontSize="sm"
        maxW="container.xl"
        lazyMount
        unmountOnExit
        // The recipe applies content padding under &[data-orientation=horizontal],
        // which outranks a flat `pt` style prop — drive its var instead.
        css={{ "--tabs-content-padding": "spacing.16" }}
      >
        <Tabs.List bg="bg.surface">
          <Tabs.Trigger value="open-source" {...triggerStyles}>
            <Trans
              i18nKey="projects-tab-open-source"
              components={[<chakra.span key="0" hideBelow="sm" />]}
            />
          </Tabs.Trigger>
          <Tabs.Trigger value="projects" {...triggerStyles}>
            {t("projects-tab-projects")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="open-source">
          <VStack asChild gap="16">
            <List.Root
              aria-label="Open Source Contributions"
              listStyleType="none"
            >
              {openSourceData.map((data, idx) => (
                <Center asChild key={idx} w="full">
                  <List.Item>
                    <OpenSourceItemCard {...data} />
                  </List.Item>
                </Center>
              ))}
            </List.Root>
          </VStack>
        </Tabs.Content>
        <Tabs.Content value="projects">
          <VStack asChild gap="16">
            <List.Root aria-label="Personal Projects" listStyleType="none">
              {projectsData.map((data, idx) => (
                <Center asChild key={idx} w="full">
                  <List.Item>
                    <ProjectItemCard idx={idx} {...data} />
                  </List.Item>
                </Center>
              ))}
            </List.Root>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
