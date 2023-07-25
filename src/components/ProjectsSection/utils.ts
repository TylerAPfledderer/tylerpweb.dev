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
import { ProjectItemCardProps } from "./ProjectItemCard";

export const openSourceData = [
  {
    icon: ChakraIcon,
    title: "Chakra UI",
    role: "Collaborator",
    description: [
      "Since May of 2022, I have served as an external Collaborator for an organization of the same name whose primary package is a UI component library original built for React.",
      "Contributions consisted of various tasks to improve the Chakra docsite content and underlying scripts, building of a package version for Vue 3, building Vue components for the new Ark UI headless component library, and adding components to the Chakra Pro site.",
    ],
    contributionUrl:
      "https://github.com/pulls?q=is%3Apr+author%3ATylerAPfledderer+user%3Achakra-ui+",
    projectGithub: "https://github.com/chakra-ui",
  },
  {
    icon: EthIcon,
    title: "Ethereum.org",
    role: "Power Contributor",
    description: [
      "I became a primary contributor to Ethereum.org in September 2022, helping them migrate their UI from Styled Components to Chakra UI. I worked as a liaison between the core teams, migrating components, reviewing PRs, auditing migrations and accessibility, and integrating StorybookJS into their workflow for the new Design System.",
      "I had frequent communication with the lead developer, designer, and the rest of the team, which helped ensure the site's aesthetics and usability met expectations. I was also honored to receive an Impact Gift from the Ethereum Foundation as recognition for my contributions.",
    ],
    contributionUrl:
      "https://github.com/pulls?q=is%3Apr+author%3ATylerAPfledderer+user%3Aethereum",
    projectGithub: "https://github.com/ethereum/ethereum-org-website",
  },
];

export const projectsData: ProjectItemCardProps[] = [
  {
    demoUrl: "https://coffeeroastersub.gatsbyjs.io/",
    description:
      "A design-to-code 3-page subscription site, showcasing an interactive form to present subscription options. Chakra UI is used for reusable Styled components that are accessible first, and TypeScript for strict type-checking state and all static querying from GraphQL.",
    githubSlug: "coffeeroaster-subscription-site",
    image: "/images/projects/coffeeroasters-preview.png",
    projectName: "Coffeeroaster Subscription Site",
    stackTags: [GatsbyIcon, ChakraIcon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/url-shortening-api/",
    description:
      "A design-to-code project focusing on the use of the Shrtcode API to shorten URLs. Use of Vuex and Local Storage to persist the list of generated links and the ability to copy them easily.",
    githubSlug: "url-shortening-api",
    image: "/images/projects/url-shorten-preview.png",
    projectName: "URL Shortener",
    stackTags: [VueIcon, CSS3Icon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/college-email-newsletter/",
    description:
      "Based on a real newsletter from a local community college small business center. Uses vanilla HTML and inline CSS techniques with updated design and responsiveness. (All links do not work)",
    githubSlug: "college-email-newsletter",
    image: "/images/projects/newsletter-email-preview.png",
    projectName: "College Newsletter Email",
    stackTags: [HTML5Icon, CSS3Icon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/cloudflare/",
    description:
      "A responsive login screen built in HTML. Heavy emphasis with SASS including robust mixins such as 'flexy' to apply all the needed Flexbox properties with backward-compatible prefixes.",
    githubSlug: "cloudflare",
    image: "/images/projects/cloudflare-preview.png",
    projectName: "Cloudflare Login Screen",
    stackTags: [HTML5Icon, SassIcon],
  },
  {
    demoUrl: "https://tylerapfledderer.github.io/weather-app-react",
    description:
      "A responsive login screen built in HTML. Heavy emphasis with SASS including robust mixins such as 'flexy' to apply all the needed Flexbox properties with backward-compatible prefixes.",
    githubSlug: "weather-app-react",
    image: "/images/projects/weather-app-preview.png",
    projectName: "Desktop Weather App",
    stackTags: [ReactIcon, SassIcon],
  },
];
