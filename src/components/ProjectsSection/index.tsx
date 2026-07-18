import {
  Box,
  Flex,
  Grid,
  Heading,
  List,
  Tabs,
  Text,
  VStack,
  chakra,
} from "@chakra-ui/react";
import { OpenSourceItemCard } from "./OpenSourceItemCard";
import { openSourceData, projectsData } from "./utils";
import { ProjectItemCard } from "./ProjectItemCard";
import { useTranslation } from "next-i18next";

// The design's pill toggle. `subtle` (not `enclosed`) gives the trigger no list
// surface and no drop-shadow — so the enclosed variant's un-overridden
// `_selected:{shadow:"xs"}` light-mode leak is gone by construction. v3's subtle
// `_selected` still sets `colorPalette.subtle`/`.fg`, which resolve their _light
// branch on this dark site (the `:root &` trap — see .claude/rules/chakra-v3.md),
// so both idle `color` and the `_selected` bg/color are pinned to design tokens.
const triggerStyles = {
  minH: "44px",
  px: "6",
  rounded: "full",
  fontWeight: "700",
  // 14.5px — the design's pill label size.
  fontSize: "0.90625rem",
  color: "#b8c9c8",
  _selected: {
    bg: "accent.solid",
    color: "accent.contrast",
  },
} as const;

export const ProjectsSection = () => {
  const { t } = useTranslation();
  return (
    // Full-bleed band. MainSection is frozen legacy (see its file); redesigned
    // sections render their own <section> with the alternating canvas/band bg.
    // This one still sits INSIDE the shared MainSection until Skills/the sweep PR
    // removes that wrapper — the double-wrap is temporary and touches only Work.
    <chakra.section
      id="work"
      display="flex"
      w="full"
      bg="bg.band"
      borderYWidth="1px"
      borderColor="border.subtle"
      textAlign="start"
    >
      <VStack
        w="full"
        maxW="container.page"
        mx="auto"
        px="clamp(20px, 5vw, 32px)"
        py="clamp(64px, 12vw, 120px)"
        gap={{ base: "8", md: "11" }}
        align="stretch"
      >
      <VStack gap="5" align="start">
        <Text textStyle="mono" color="accent.emphasis">
          {t("projects-kicker")}
        </Text>
        <Heading textStyle="h2">{t("projects-title")}</Heading>
      </VStack>
      <Tabs.Root
        defaultValue="open-source"
        variant="subtle"
        w="full"
        lazyMount
        unmountOnExit
        // The recipe applies content padding under &[data-orientation=horizontal],
        // which outranks a flat `pt` style prop — drive its var instead.
        css={{ "--tabs-content-padding": "spacing.11" }}
      >
        {/* Pill track: bg accent.wash, hairline border.subtle, self-start. */}
        <Tabs.List
          alignSelf="flex-start"
          display="inline-flex"
          gap="1.5"
          p="1"
          rounded="full"
          bg="accent.wash"
          borderWidth="1px"
          borderColor="border.subtle"
        >
          <Tabs.Trigger value="open-source" {...triggerStyles}>
            {t("projects-tab-open-source")}
          </Tabs.Trigger>
          <Tabs.Trigger value="projects" {...triggerStyles}>
            {t("projects-tab-projects")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="open-source">
          {/* OSS: 2-up flex-wrap. Cards fill their cell (flex:1 1 300px), so
              they sit side-by-side on wide screens and stack when narrower.
              flexDirection="row" is REQUIRED: v3's List.Root recipe hardcodes
              flexDirection:column, which wins through asChild and would stack
              the cards at every width. */}
          <Flex asChild gap="6" wrap="wrap" flexDirection="row">
            <List.Root
              aria-label="Open Source Contributions"
              listStyleType="none"
            >
              {openSourceData.map((data, idx) => (
                <Box asChild key={idx} flex="1 1 300px" display="flex">
                  <List.Item>
                    <OpenSourceItemCard {...data} />
                  </List.Item>
                </Box>
              ))}
            </List.Root>
          </Flex>
        </Tabs.Content>
        <Tabs.Content value="projects">
          {/* Projects: responsive minmax grid. Cards fill their cell. */}
          <Grid
            asChild
            gap="6"
            gridTemplateColumns="repeat(auto-fill, minmax(min(100%, 260px), 1fr))"
          >
            <List.Root aria-label="Personal Projects" listStyleType="none">
              {projectsData.map((data, idx) => (
                <Box asChild key={idx} display="flex">
                  <List.Item>
                    <ProjectItemCard {...data} />
                  </List.Item>
                </Box>
              ))}
            </List.Root>
          </Grid>
        </Tabs.Content>
      </Tabs.Root>
      </VStack>
    </chakra.section>
  );
};
