import {
  FaEnvelope,
  FaGithub,
  FaLinkedinIn,
  FaTwitterSquare,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

type SocialMediaLinkType = {
  href: string;
  icon: IconType;
  label: string;
  platform: "Github" | "Twitter" | "Linkedin" | "Email";
};

export const socialMediaLinks: SocialMediaLinkType[] = [
  {
    href: "https://twitter.com/t_pfledderer/",
    icon: FaTwitterSquare,
    label: "@t_pfledderer",
    platform: "Twitter",
  },
  {
    href: "https://github.com/tylerapfledderer",
    icon: FaGithub,
    label: "@tylerapfledderer",
    platform: "Github",
  },
  {
    href: "https://linkedin.com/in/tyler-pfledderer",
    icon: FaLinkedinIn,
    label: "in/tyler-pfledderer",
    platform: "Linkedin",
  },
  {
    href: "mailto:tyler.pfledderer@gmail.com",
    icon: FaEnvelope,
    label: "tyler.pfledderer@gmail.com",
    platform: "Email",
  },
];
