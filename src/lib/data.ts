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
  /** The full handle. Retained for future use; the redesigned Hero renders
   *  `shortLabel` in its social pills, not this. */
  label: string;
  /**
   * The redesign's hero pill text — deliberately terser than `label`.
   *
   * NOT routed through i18n, matching the existing precedent for this file.
   * Three of the four are brand/handle strings that must never be translated.
   * The fourth, "Email", IS an ordinary English word and is the one member that
   * arguably should be a t() key on a 13-locale site. Left plain so the choice is
   * visible rather than buried: the Hero/Contact section PRs own the call.
   */
  shortLabel: string;
  platform: "Github" | "Twitter" | "Linkedin" | "Email";
};

export const socialMediaLinks: SocialMediaLinkType[] = [
  {
    href: "https://twitter.com/t_pfledderer/",
    icon: FaTwitterSquare,
    label: "@t_pfledderer",
    shortLabel: "@t_pfledderer",
    platform: "Twitter",
  },
  {
    href: "https://github.com/tylerapfledderer",
    icon: FaGithub,
    label: "@tylerapfledderer",
    shortLabel: "GitHub",
    platform: "Github",
  },
  {
    href: "https://linkedin.com/in/tyler-pfledderer",
    icon: FaLinkedinIn,
    label: "in/tyler-pfledderer",
    shortLabel: "LinkedIn",
    platform: "Linkedin",
  },
  {
    href: "mailto:tyler.pfledderer@gmail.com",
    icon: FaEnvelope,
    label: "tyler.pfledderer@gmail.com",
    shortLabel: "Email",
    platform: "Email",
  },
];
