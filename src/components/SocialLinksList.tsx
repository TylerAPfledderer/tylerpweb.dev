import { socialMediaLinks } from "@/data";
import { Flex, Icon, Link, List, ListItem, keyframes } from "@chakra-ui/react";

const waggle = keyframes({
  "10%": {
    transform: "scale(0.8) rotate(-20deg)",
  },
  "40%": {
    transform: "scale(1.9) rotate(10deg)",
  },
  "60%": {
    transform: "scale(1.6) rotate(-10deg)",
  },
  "100%": {
    transform: "scale(1.4)",
  },
});

export const SocialLinksList = () => (
  <Flex
    as={List}
    aria-label="social media"
    justify="center"
    flexWrap={{ sm: "wrap" }}
    flexDir={["column", "row"]}
    gap={8}
  >
    {socialMediaLinks.map(({ href, icon, label, platform }) => (
      <ListItem key={label}>
        <Flex
          as={Link}
          href={href}
          flexDir="column"
          fontSize="sm"
          align="center"
          target="_blank"
          aria-label={`My ${platform}`}
          _hover={{
            svg: {
              color: "#E00400",
              animation: `${waggle} forwards .5s`,
            },
          }}
        >
          <Icon as={icon} display="block" fontSize="lg" />
          {label}
        </Flex>
      </ListItem>
    ))}
  </Flex>
);
