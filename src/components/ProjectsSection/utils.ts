import {
  CSS3Icon,
  ChakraIcon,
  EthIcon,
  GatsbyIcon,
  HTML5Icon,
  ReactIcon,
  SassIcon,
  VueIcon,
} from "@/svg-icons";
import type { Icon } from "@chakra-ui/react";
import type { ParseKeys } from "i18next";

type OpenSourceDataKeys = ParseKeys<"open-source-data">;

export type OpenSourceDataItem = {
  icon: typeof Icon;
  title: string;
  role: OpenSourceDataKeys;
  description: OpenSourceDataKeys[];
  contributionUrl: string;
  projectGithub: string;
};

export const openSourceData: OpenSourceDataItem[] = [
  {
    icon: ChakraIcon,
    title: "Chakra UI",
    role: "open-source-collaborator",
    description: ["open-source-chakra-desc-1", "open-source-chakra-desc-2"],
    contributionUrl:
      "https://github.com/pulls?q=is%3Amerged+is%3Apr+author%3ATylerAPfledderer+archived%3Afalse+org%3Achakra-ui",
    projectGithub: "https://github.com/chakra-ui",
  },
  {
    icon: EthIcon,
    title: "Ethereum.org",
    role: "open-source-power-contributor",
    description: ["open-source-eth-desc-1", "open-source-eth-desc-2"],
    contributionUrl:
      "https://github.com/pulls?q=is%3Amerged+is%3Apr+author%3ATylerAPfledderer+archived%3Afalse+org%3Aethereum",
    projectGithub: "https://github.com/ethereum/ethereum-org-website",
  },
];

type ProjectsItemDataKeys = ParseKeys<"projects-item-data">;

export type ProjectDataItem = {
  image: string;
  stackTags: Array<typeof Icon>;
  projectName: ProjectsItemDataKeys;
  description: ProjectsItemDataKeys;
  githubSlug: string;
  demoUrl: string;
};

export const projectsData: ProjectDataItem[] = [
  {
    demoUrl: "https://coffeeroastersub.gatsbyjs.io/",
    description: "project-item-coffeeroaster-description",
    githubSlug: "coffeeroaster-subscription-site",
    image: "/images/projects/coffeeroasters-preview.png",
    projectName: "project-item-coffeeroaster-title",
    stackTags: [GatsbyIcon, ChakraIcon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/url-shortening-api/",
    description: "project-item-urlshortener-description",
    githubSlug: "url-shortening-api",
    image: "/images/projects/url-shorten-preview.png",
    projectName: "project-item-urlshortener-title",
    stackTags: [VueIcon, CSS3Icon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/college-email-newsletter/",
    description: "project-item-collegeemail-description",
    githubSlug: "college-email-newsletter",
    image: "/images/projects/newsletter-email-preview.png",
    projectName: "project-item-collegeemail-title",
    stackTags: [HTML5Icon, CSS3Icon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/cloudflare/",
    description: "project-item-cloudflare-description",
    githubSlug: "cloudflare",
    image: "/images/projects/cloudflare-preview.png",
    projectName: "project-item-cloudflare-title",
    stackTags: [HTML5Icon, SassIcon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/weather-app-react",
    description: "project-item-weatherapp-description",
    githubSlug: "weather-app-react",
    image: "/images/projects/weather-app-preview.png",
    projectName: "project-item-weatherapp-title",
    stackTags: [ReactIcon, SassIcon],
  },
];
