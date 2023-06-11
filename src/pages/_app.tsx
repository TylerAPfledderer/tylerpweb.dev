import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { Titillium_Web, Mulish } from "next/font/google";
import theme from "../lib/theme";
import { DefaultSeo } from "next-seo";
import seo from "../../next-seo.config";

const titilliumWeb = Titillium_Web({
  weight: "700",
  subsets: ["latin"],
});
const mulish = Mulish({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-tw: ${titilliumWeb.style.fontFamily};
            --font-mulish: ${mulish.style.fontFamily};
          }
        `}
      </style>
      <DefaultSeo {...seo} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
