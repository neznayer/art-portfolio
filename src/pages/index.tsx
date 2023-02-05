import { type NextPage } from "next";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { api } from "../utils/api";
import ArtCard from "../components/ArtCard";
import { useEffect, useState } from "react";
import { type IArt } from "../types/art";
import TagsField from "../components/Tags/TagsField";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Home: NextPage = () => {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const { data: artsArray, isSuccess } = api.art.highlightedArts.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  );

  const { data: allTags } = api.art.allTags.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const [shownArts, setShownArts] = useState<IArt[]>([]);

  function handleTagFilter(tag: string) {
    setSelectedTag(tag);
    setShownArts(artsArray?.filter((art) => art.tags?.includes(tag)) || []);
  }

  function handleRemoveTagFilter() {
    setSelectedTag("");
    setShownArts(artsArray || []);
  }

  useEffect(() => {
    if (artsArray) {
      setShownArts(artsArray);
    }
  }, [artsArray]);

  return (
    <>
      <Head>
        <title>Neznayer art portfolio</title>
        <meta
          name="description"
          content="Anton Nezanyer's artworks portfolio"
        />
      </Head>
      <main className="flex flex-col justify-start gap-4">
        <header className="flex h-[100px] items-center justify-center text-xl">
          <h1 className={`${inter.className} inline-block`}>
            Neznayer Art portfolio
          </h1>
        </header>

        <div className="flex flex-1 gap-[12px] px-10">
          <section className="w-[200px]">
            <h3>Selected tag</h3>
            {selectedTag && (
              <TagsField
                tags={[selectedTag]}
                onTagClick={handleRemoveTagFilter}
                mode="control"
              />
            )}
            <h3>Tags</h3>
            <TagsField
              tags={allTags || []}
              onTagClick={handleTagFilter}
              mode="view"
            />
          </section>
          <section className="flex flex-1 items-start justify-center">
            <div className="flex h-full w-[50%] flex-wrap">
              {isSuccess &&
                shownArts?.map((art) => {
                  return <ArtCard key={art.id} {...art} />;
                })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
