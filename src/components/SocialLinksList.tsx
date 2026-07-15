import { socialMediaLinks } from "@/data";
import { Flex, Icon, Link, List } from "@chakra-ui/react";

export const SocialLinksList = () => (
  <Flex
    asChild
    justify="center"
    flexWrap={{ sm: "wrap" }}
    flexDir={["column", "row"]}
    gap={8}
  >
    <List.Root aria-label="social media" listStyleType="none">
      {socialMediaLinks.map(({ href, icon, label, platform }) => (
        <List.Item key={label}>
          {/* gap={0}: v3's Link recipe base sets gap:1.5, which v2's Link did not
              have — without this the icon and label drift 6px apart. */}
          <Flex asChild flexDir="column" fontSize="sm" align="center" gap={0}>
            <Link
              href={href}
              color="inherit"
              target="_blank"
              aria-label={`My ${platform}`}
              _hover={{
                "& svg": {
                  color: "#E00400",
                  animationName: "waggle",
                  animationDuration: ".5s",
                  animationFillMode: "forwards",
                },
              }}
            >
              <Icon as={icon} display="block" fontSize="lg" />
              {label}
            </Link>
          </Flex>
        </List.Item>
      ))}
    </List.Root>
  </Flex>
);
