import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { appWithTranslation } from "next-i18next";
// Self-hosted fonts (bundled, no build-time Google Fonts fetch — keeps builds/deploys
// reliable and offline-capable). Registers the "Titillium Web" / "Mulish" families used
// by the theme via var(--font-tw) / var(--font-mulish).
import "@fontsource/titillium-web/700.css";
import "@fontsource/mulish/400.css";
// JetBrains Mono via var(--font-mono). 400 = labels/tags/sha; 500 = kickers.
// The design's font link also requests 600, but no mono element uses it.
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import { Provider } from "../components/ui/provider";
import seo from "../../next-seo.config";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-tw: "Titillium Web", sans-serif;
            --font-mulish: "Mulish", sans-serif;
            --font-mono: "JetBrains Mono", ui-monospace, monospace;
          }
        `}
      </style>
      <DefaultSeo {...seo} />
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default appWithTranslation(App);
