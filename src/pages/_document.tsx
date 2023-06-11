import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link href="/favicon_io/favicon.ico" rel="shortcut icon" />
        <link href="/favicon_io/site.webmanifest" rel="manifest" />
        <link
          href="/favicon_io/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon_io/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon_io/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
