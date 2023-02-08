import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

import { api } from "../utils/api";

import "../styles/globals.css";

import { ArtContext, TagsContext } from "../utils/Context";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { data: artsArray } = api.art.highlightedArts.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { data: allTags } = api.art.allTags.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <SessionProvider session={session}>
      <ArtContext.Provider value={artsArray || []}>
        <TagsContext.Provider value={allTags || []}>
          <Component {...pageProps} />
        </TagsContext.Provider>
      </ArtContext.Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
