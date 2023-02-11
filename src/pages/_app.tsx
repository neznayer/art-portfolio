import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { type AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

import { api } from "../utils/api";

import "../styles/globals.css";

import { ArtContext, TagsContext } from "../utils/Context";
import { artRouter } from "../server/api/routers/art";
import { createInnerTRPCContext } from "../server/api/trpc";
import { type Art } from "@prisma/client";

type TProps = {
  allArts: Art[] | null;
  allTags: string[] | null;
};
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { allArts: artsArray, allTags } = pageProps as TProps;

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

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: artRouter,
    ctx: createInnerTRPCContext({ session: null }),
  });

  const allArts = await ssg.allArts.fetch();
  const allTags = await ssg.allTags.fetch();

  return {
    props: {
      allArts,
      allTags,
    },
  };
}

export default api.withTRPC(MyApp);
