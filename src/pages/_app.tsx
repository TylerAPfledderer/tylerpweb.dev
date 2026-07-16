import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { appWithTranslation } from "next-i18next";
// Self-hosted fonts (bundled, no build-time Google Fonts fetch — keeps builds/deploys
// reliable and offline-capable). Registers the "Titillium Web" / "Mulish" families used
// by the theme via var(--font-tw) / var(--font-mulish).
// Weights are added only where a rule actually USES them — the design's Google
// Fonts link over-declares (it requests Titillium 400 and Mulish 500, which no
// rule in either design file references). Keep this list IDENTICAL to the one in
// .storybook/preview.tsx: without a matching @font-face, Chromatic's Linux
// container silently falls back to a system font and the visual gate stops
// testing what production renders.
// 700 = display/h1/h2; 600 = h3 (textStyles.h3) and the nav panel links.
import "@fontsource/titillium-web/600.css";
import "@fontsource/titillium-web/700.css";
// 400 = body; 600 = outline button / nav pill / tabs; 700 = the amber CTA.
// 600 and 700 are consumed by buttonRecipe's variants.
import "@fontsource/mulish/400.css";
import "@fontsource/mulish/600.css";
import "@fontsource/mulish/700.css";
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
