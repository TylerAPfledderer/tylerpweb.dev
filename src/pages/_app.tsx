import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { Titillium_Web, Mulish } from "next/font/google";
import { appWithTranslation } from "next-i18next";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../lib/theme";
import seo from "../../next-seo.config";

export const titilliumWeb = Titillium_Web({
  weight: "700",
  subsets: ["latin"],
});
export const mulish = Mulish({
  weight: "400",
  subsets: ["latin"],
});

function App({ Component, pageProps }: AppProps) {
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

export default appWithTranslation(App);
