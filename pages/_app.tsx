import "/styles/globals.css";
import "/styles/theme.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
 import theme from "../theme/themeConfig";
  

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ConfigProvider theme={theme}>
        <Component {...pageProps} />
      </ConfigProvider>
    </SessionProvider>
  );
}
