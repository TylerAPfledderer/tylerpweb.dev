import { Box, Flex, Heading, Text, VStack, chakra } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";

// The design's 11 skills, in order, each with the brand colour used for the
// commit-rail ring stroke + dot fill (Portfolio.dc.html §skills renderVals).
// Local to this section: it is the only consumer, mirroring the previous in-file
// skills array and the Work/About local-styled-data convention. Names are brand
// proper nouns — literals, not t() keys.
const SKILLS = [
  { label: "HTML5", color: "#E34F26" },
  { label: "CSS3", color: "#1572B6" },
  { label: "JavaScript", color: "#F7DF1E" },
  { label: "SASS", color: "#CC6699" },
  { label: "Bootstrap", color: "#7952B3" },
  { label: "VueJS", color: "#42B883" },
  { label: "ReactJS", color: "#61DAFB" },
  { label: "GatsbyJS", color: "#8A4BAF" },
  { label: "TailwindCSS", color: "#38BDF8" },
  { label: "Chakra UI", color: "#2F9E9B" },
  { label: "NextJS", color: "#cfd8d7" },
] as const;

const sha = (i: number) => `#${String(i + 1).padStart(2, "0")}`;

// Rail geometry: 11 nodes evenly spaced across the 1180-wide viewBox, 60→1120.
const RAIL_X0 = 60;
const RAIL_STEP = (1120 - RAIL_X0) / (SKILLS.length - 1); // 106

// Desktop commit rail (shown once the section's own width clears 820px, via the
// themed `skillsWide` container condition). An SVG: a base line, an animated teal
// line drawn in via `drawrail`, and one node per skill (ring in the brand colour,
// inner dot, label alternating above/below, sha). drawrail is `to`-only, so the
// teal line supplies its own inline start state (dasharray/offset 1 on pathLength
// 1) or it renders already-drawn. Reduced-motion resolves animations to their
// final state (rail drawn) — correct here.
const DesktopRail = () => (
  <Box display="none" _skillsWide={{ display: "block" }} pt="2" pb="5" px="1">
    <chakra.svg
      viewBox="0 0 1180 300"
      w="full"
      display="block"
      role="img"
      aria-label="Commit rail of skills learned along the way"
    >
      <line
        x1="40"
        y1="150"
        x2="1140"
        y2="150"
        stroke="rgba(86,196,218,.18)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="40"
        y1="150"
        x2="1140"
        y2="150"
        stroke="#33a6c0"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animationName: "drawrail",
          animationDuration: "2s",
          animationTimingFunction: "ease",
          animationDelay: ".2s",
          animationFillMode: "forwards",
        }}
      />
      {SKILLS.map((s, i) => {
        const x = RAIL_X0 + RAIL_STEP * i;
        const above = i % 2 === 0;
        const tickY = above ? 96 : 204;
        const labelY = above ? 78 : 224;
        const shaY = above ? 60 : 242;
        return (
          <g
            key={s.label}
            style={{
              transformOrigin: `${x}px 150px`,
              animationName: "nodepop",
              animationDuration: ".5s",
              animationTimingFunction: "ease",
              animationDelay: `${0.4 + i * 0.13}s`,
              animationFillMode: "both",
            }}
          >
            <line
              x1={x}
              y1={150}
              x2={x}
              y2={tickY}
              stroke="rgba(86,196,218,.25)"
              strokeWidth={2}
            />
            <circle
              cx={x}
              cy={150}
              r={13}
              fill="#0b1617"
              stroke={s.color}
              strokeWidth={3}
            />
            <circle cx={x} cy={150} r={5.5} fill={s.color} />
            <text
              x={x}
              y={labelY}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={15}
              fontWeight={600}
              fill="#dbeceb"
            >
              {s.label}
            </text>
            <text
              x={x}
              y={shaY}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fill="#7a9ea0"
            >
              {sha(i)}
            </text>
          </g>
        );
      })}
    </chakra.svg>
  </Box>
);

// Mobile commit-chip grid — the narrow-width copy. Reflows into 1–3 columns to
// fill width; hidden once the rail takes over.
const MobileChips = () => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(auto-fill, minmax(220px, 1fr))"
    gap="3"
    _skillsWide={{ display: "none" }}
  >
    {SKILLS.map((s, i) => (
      <Flex
        key={s.label}
        align="center"
        gap="3.5"
        px="4"
        py="3.5"
        rounded="13px"
        bg="accent.wash"
        borderWidth="1px"
        borderColor="border.subtle"
      >
        <Box
          flex="none"
          boxSize="20px"
          rounded="full"
          bg="bg.canvas"
          borderWidth="3px"
          borderColor={s.color}
        />
        <Flex align="baseline" justify="space-between" gap="3" flex="1" minW="0">
          <Text
            as="span"
            fontFamily="heading"
            fontWeight="600"
            fontSize="19px"
            color="fg"
          >
            {s.label}
          </Text>
          <Text
            as="span"
            flex="none"
            fontFamily="mono"
            fontSize="12px"
            color="fg.subtle"
          >
            {sha(i)}
          </Text>
        </Flex>
      </Flex>
    ))}
  </Box>
);

export const SkillsSection = () => {
  const { t } = useTranslation();
  return (
    // Full-bleed canvas band (the alternation: about=band, skills=canvas, work=band).
    // The legacy MainSection wrapper + JourneyLine scatter are gone.
    <Flex as="section" id="skills" w="full" bg="bg.canvas" textAlign="start">
      <VStack
        w="full"
        maxW="container.page"
        mx="auto"
        px="clamp(20px, 5vw, 32px)"
        py="clamp(64px, 12vw, 120px)"
        gap="clamp(40px, 7vw, 60px)"
        align="stretch"
      >
        <VStack gap="4" align="start">
          <Text textStyle="mono" color="accent.emphasis">
            {t("skills-kicker")}
          </Text>
          <Heading textStyle="h2" asChild>
            <h2>{t("skills-title")}</h2>
          </Heading>
          <Text color="fg.muted" textStyle="lead" maxW="52ch">
            {t("skills-desc")}
          </Text>
        </VStack>
        {/* The container query fires on THIS element's inline size, not the
            viewport — it must carry containerType + containerName or _skillsWide
            never triggers. */}
        <Box containerType="inline-size" containerName="skills">
          <DesktopRail />
          <MobileChips />
        </Box>
      </VStack>
    </Flex>
  );
};
