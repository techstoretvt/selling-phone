import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { nameWeb } from "../utils/constants";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Amiko&display=optional"
          rel="stylesheet"
        />
        <meta
          name="description"
          content={`Trang thương mại điện tử ${nameWeb}`}
        />
        {/* <Script src="https://kit.fontawesome.com/a19bb8670a.js" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
