import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { api } from "../utils/api";
import { Analytics } from "@vercel/analytics/react";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
