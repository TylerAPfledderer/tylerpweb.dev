import { socialMediaLinks } from "@/data";
import { Flex, Icon, Link, List } from "@chakra-ui/react";

const waggle = `
  @keyframes waggle {
    10% { transform: scale(0.8) rotate(-20deg); }
    40% { transform: scale(1.9) rotate(10deg); }
    60% { transform: scale(1.6) rotate(-10deg); }
    100% { transform: scale(1.4); }
  }
`;

const waggleAnimation = "waggle forwards 0.5s";

export const SocialLinksList = () => (
  <>
    <style dangerouslySetInnerHTML={{ __html: waggle }} />
    <List.Root asChild>
      <Flex
        aria-label="social media"
        justify="center"
        flexWrap={{ sm: "wrap" }}
        flexDir={["column", "row"]}
        gap={8}
      >
        {socialMediaLinks.map(({ href, icon, label, platform }) => (
          <List.Item key={label}>
          <Link
            href={href}
            display="flex"
            flexDir="column"
            fontSize="sm"
            alignItems="center"
            target="_blank"
            aria-label={`My ${platform}`}
            _hover={{
              "& svg": {
                color: "#E00400",
                animation: waggleAnimation,
              },
            }}
          >
            <Icon as={icon} display="block" fontSize="lg" />
            {label}
          </Link>
        </List.Item>
      ))}
      </Flex>
    </List.Root>
  </>
);
