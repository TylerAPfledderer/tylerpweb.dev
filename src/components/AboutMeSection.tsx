import {
  Heading,
  Highlight,
  Stack,
  Text,
  VStack,
  calc,
  useToken,
} from "@chakra-ui/react";
import { MainSection } from "./MainSection";
import { Trans, useTranslation } from "next-i18next";

export const AboutMeSection = () => {
  const { t } = useTranslation();

  const size28 = useToken("sizes", 28);
  const skewBackgroundStyles = {
    _before: {
      content: { lg: `""` },
      bg: "inherit",
      display: "block",
      position: "absolute",
      zIndex: -1,
      top: -14,
      h: calc("100%").add(size28).toString(),
      w: "100vw",
      transform: "skewY(1deg)",
      boxShadow: `inset 0px -30px 20px -18px rgba(0, 0, 0, 0.2) , 
        0px -30px 20px -18px rgba(0, 0, 0, 0.2)`,
    },
  };
  return (
    <MainSection
      bg="primary.base"
      spacing={{ base: 16, lg: 36 }}
      position="relative"
      {...skewBackgroundStyles}
    >
      <VStack spacing="text.base" maxWidth="prose">
        <Heading>
          <Highlight
            query={[t("about-title-highlight-1"), t("about-title-highlight-2")]}
            styles={{ color: "secondary.base" }}
          >
            {t("about-title")}
          </Highlight>
        </Heading>
        <Text>
          <Trans
            i18nKey="about-main-description"
            components={[
              <Text
                as="span"
                key={0}
                color="secondary.base"
                fontWeight="bold"
              />,
            ]}
          />
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "text.sm", lg: 28 }}
        align="center"
        justify="space-between"
      >
        <Heading as="h3" size="2xl" flex={1} maxW={{ lg: 72 }}>
          {t("about-background")}
        </Heading>
        <Text maxW="prose" flex={2}>
          {t("about-background-desc")}
        </Text>
      </Stack>
    </MainSection>
  );
};
