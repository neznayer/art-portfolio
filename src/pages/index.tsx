import { type NextPage } from "next";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { useEffect, useState, useContext } from "react";
import { type IArt } from "../types/art";
import GalleryItem from "../components/Gallery/GalleryItem";
import Link from "next/link";
import ViewLayout from "../components/ViewLayout";
import LeftPanel from "../components/LeftPanel";
import { ArtContext, TagsContext } from "../utils/Context";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Home: NextPage = () => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  const allArts = useContext(ArtContext);
  const allTags = useContext(TagsContext);

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
      <ViewLayout>
        <LeftPanel
          tags={allTags || []}
          selectedTag={selectedTag}
          handleRemoveTagFilter={handleRemoveTagFilter}
          handleAddTagFilter={setSelectedTag}
        />
        <section className=" flex h-[100vh] flex-1 flex-col items-start overflow-auto bg-bg-gray">
          <div className="flex w-full flex-col gap-10">
            <header className={`${inter.className} text-xl`}>
              <h1> Neznayer art</h1>
            </header>
            <div className="flex flex-wrap justify-center gap-4 px-5">
              {shownArts.length &&
                shownArts?.map((art) => {
                  return (
                    <Link
                      key={art.id}
                      href={`/art/${art.id}`}
                      className="block"
                    >
                      <GalleryItem
                        {...art}
                        mode="view"
                        className="h-[150px] w-[150px]"
                      />
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      </ViewLayout>
    </>
  );
};

export default Home;
