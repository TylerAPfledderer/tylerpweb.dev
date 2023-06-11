import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  title: "Tyler Pfledderer | Web Developer",
  description:
    "UI / UX Developer, all about accessibility and making the web a beautiful and usable place.",
  additionalMetaTags: [
    {
      name: "revisit-after",
      content: "30 days",
    },
    {
      name: "author",
      content: "Tyler Pfledderer",
    },
  ],

  twitter: {
    handle: "@t_pfledderer",
    cardType: "summary_large_image",
    site: "@t_pfledderer",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tylerpweb.dev",
    title: "Tyler Pfledderer | Web Developer",
    site_name: "Tyler Pfledderer",
    description:
      "UI / UX Developer, all about accessibility and making the web a beautiful and usable place.",
    images: [
      { url: "https://tylerpweb.dev/favicon_io/android-chrome-512x512.png" },
    ],
  },
  themeColor: "#297b91",
};

export default config;
