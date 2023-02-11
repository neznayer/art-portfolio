import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { type IArt } from "../types/art";
import ViewLayout from "../components/ViewLayout";
import LeftPanel from "../components/LeftPanel";
import { ArtContext, TagsContext } from "../utils/Context";

import LargeViewLayout from "../components/LargeViewLayout";
import Gallery from "../components/Gallery/Gallery";
import { createInnerTRPCContext } from "../server/api/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { artRouter } from "../server/api/routers/art";
import { type Art } from "@prisma/client";

const Home: NextPage<{ allArts: Art[]; allTags: string[] }> = ({
  allArts,
  allTags,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [shownArts, setShownArts] = useState<IArt[]>([]);

  function handleRemoveTagFilter() {
    setSelectedTag("");
    setShownArts(allArts || []);
  }

  useEffect(() => {
    if (selectedTag) {
      setShownArts(
        allArts?.filter((art) => art.tags?.includes(selectedTag)) || []
      );
    } else {
      setShownArts(allArts || []);
    }
  }, [selectedTag, allArts]);

  return (
    <>
      <Head>
        <title>Neznayer art portfolio</title>
        <meta
          name="description"
          content="Anton Nezanyer's artworks portfolio"
        />
      </Head>

      <ArtContext.Provider value={allArts}>
        <TagsContext.Provider value={allTags}>
          <ViewLayout>
            <LeftPanel
              tags={allTags || []}
              selectedTag={selectedTag}
              handleRemoveTagFilter={handleRemoveTagFilter}
              handleAddTagFilter={setSelectedTag}
            />
            <LargeViewLayout>
              <Gallery arts={shownArts} mode="view" />
            </LargeViewLayout>
          </ViewLayout>
        </TagsContext.Provider>
      </ArtContext.Provider>
    </>
  );
};

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: artRouter,
    ctx: createInnerTRPCContext({ session: null }),
  });

  const allArts = await ssg.highlightedArts.fetch();
  const allTags = allArts.flatMap((art) => art.tags);

  const parsedArts = allArts.map((art) => ({
    ...art,
    createdAt: art.createdAt.valueOf(),
    updatedAt: art.updatedAt.valueOf(),
  }));

  return {
    props: {
      allArts: parsedArts,
      allTags,
    },
    revalidate: 20,
  };
}

export default Home;
