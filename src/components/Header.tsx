import { useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import {
  Box,
  Button,
  Flex,
  Text,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";

// Contact is deliberately NOT in this list: it renders as a CTA (pill on
// desktop, filled button in the mobile panel) rather than a plain text link, so
// both branches would have to slice it back out.
const NAV_LINKS = [
  { href: "#about", key: "header-nav-about" },
  { href: "#skills", key: "header-nav-skills" },
  { href: "#work", key: "header-nav-work" },
] as const;

const CONTACT_HREF = "#contact";

// The design's 999px nav Contact pill (Portfolio.dc.html §header). Local because
// the button recipe's size/radius (30px/13px) differ from this pill's 20px/999px
// — theme.ts scopes THIS shape out of the shared recipe. The mobile panel's CTA
// is a different shape and does use the recipe (solidTeal) below.
const NavContactPill = chakra("a", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    minH: "44px",
    px: "20px",
    rounded: "999px",
    bg: "accent.solid",
    color: "accent.contrast",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "background-color .18s ease",
    _hover: { bg: "accent.emphasis" },
  },
});

const MobileNavLink = chakra("a", {
  base: {
    display: "flex",
    alignItems: "center",
    minH: "52px",
    fontFamily: "heading",
    fontWeight: "600",
    fontSize: "1.1875rem",
    color: "#dbeceb",
    borderBottomWidth: "1px",
    borderColor: "rgba(86,196,218,.08)",
  },
});

export const Header = () => {
  const { t } = useTranslation();
  const { open: menuOpen, onToggle, onClose } = useDisclosure();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Escape-to-close + focus-return: the panel unmounts on close (it's
  // conditionally rendered, not hidden), so without this focus falls back to
  // <body> — a real a11y regression for keyboard/screen-reader users.
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, onClose]);

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="20"
      backdropFilter="blur(12px)"
      bg="rgba(11,22,23,.78)"
      borderBottomWidth="1px"
      borderColor="rgba(86,196,218,.12)"
    >
      {/* Height is intentionally NOT pinned here — the row sizes to its tallest
          child (the 44px contact pill / menu toggle). --header-h in theme.ts
          records that measured result for the section[id] scroll-margin rule;
          pinning minH to the same var would double-count the 1px border. */}
      <Flex
        as="nav"
        w="full"
        maxW="container.page"
        mx="auto"
        px="clamp(20px, 5vw, 32px)"
        py="14px"
        align="center"
        justify="space-between"
        gap="4"
      >
        <Flex asChild align="center" gap="3" color="fg" minW="0">
          <a href="#top">
            <Flex
              flex="none"
              w="40px"
              h="40px"
              rounded="12px"
              align="center"
              justify="center"
              bgGradient="to-br"
              gradientFrom="accent.solid"
              gradientTo="#1f6f80"
              fontFamily="heading"
              fontWeight="700"
              fontSize="lg"
              color="#04191d"
              boxShadow="0 6px 18px rgba(51,166,192,.3)"
            >
              TP
            </Flex>
            <Text
              as="span"
              fontFamily="heading"
              fontWeight="700"
              fontSize="md"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {t("header-brand-name")}
            </Text>
          </a>
        </Flex>

        <Flex align="center" gap="clamp(16px, 3vw, 30px)" fontSize="sm">
          <Flex hideBelow="nav" align="center" gap="clamp(16px, 3vw, 30px)">
            {NAV_LINKS.map(({ href, key }) => (
              <chakra.a
                key={href}
                href={href}
                display="inline-flex"
                alignItems="center"
                minH="44px"
                color="#b8c9c8"
                _hover={{ color: "fg" }}
              >
                {t(key)}
              </chakra.a>
            ))}
            <NavContactPill href={CONTACT_HREF}>
              {t("header-nav-contact")}
            </NavContactPill>
          </Flex>

          <Flex
            asChild
            hideFrom="nav"
            align="center"
            justify="center"
            w="44px"
            h="44px"
            borderWidth="1px"
            borderColor="rgba(86,196,218,.22)"
            rounded="12px"
            bg="rgba(86,196,218,.06)"
            cursor="pointer"
            color="fg"
          >
            <button
              ref={toggleRef}
              type="button"
              aria-label={t("header-menu-toggle-label")}
              aria-expanded={menuOpen}
              aria-controls="header-mobile-panel"
              onClick={onToggle}
            >
              {menuOpen ? (
                <Text as="span" fontSize="22px" lineHeight="1" fontWeight="400">
                  ✕
                </Text>
              ) : (
                <Flex direction="column" gap="1" w="20px">
                  <Box h="2px" bg="fg" rounded="2px" />
                  <Box h="2px" bg="fg" rounded="2px" />
                  <Box h="2px" bg="fg" rounded="2px" />
                </Flex>
              )}
            </button>
          </Flex>
        </Flex>
      </Flex>

      {menuOpen && (
        <Box
          id="header-mobile-panel"
          hideFrom="nav"
          borderTopWidth="1px"
          borderColor="rgba(86,196,218,.12)"
          bg="rgba(11,22,23,.97)"
          css={{
            animationName: "fadeup",
            animationDuration: ".22s",
            animationTimingFunction: "ease",
            animationFillMode: "both",
          }}
        >
          <Flex
            direction="column"
            gap="1"
            w="full"
            maxW="container.page"
            mx="auto"
            px="clamp(20px, 5vw, 32px)"
            pt="12px"
            pb="20px"
          >
            {NAV_LINKS.map(({ href, key }) => (
              <MobileNavLink key={href} href={href} onClick={onClose}>
                {t(key)}
              </MobileNavLink>
            ))}
            {/* The panel CTA is the shared solidTeal button, not a hand-rolled
                anchor: every value it needs (13px radius, 16.5px, weight 700,
                accent.solid/contrast + emphasis hover) already IS that recipe.
                Only the 52px touch target and full-width stretch are local. */}
            <Button asChild variant="solidTeal" w="full" minH="52px" mt="2.5">
              <a href={CONTACT_HREF} onClick={onClose}>
                {t("header-nav-contact")}
              </a>
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
