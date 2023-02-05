import { type NextPage } from "next";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { api } from "../utils/api";
import ArtCard from "../components/ArtCard";
import { useEffect, useState } from "react";
import { type IArt } from "../types/art";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Home: NextPage = () => {
  const [selectedTag, setSelectedTag] = useState<string>("");
  const { data: artsArray, isSuccess } = api.art.highlightedArts.useQuery({
    tag: selectedTag,
  });
  const { data: allTags } = api.art.allTags.useQuery();
  const [shownArts, setShownArts] = useState<IArt[]>([]);

  function handleTagFilter(tag: string) {
    setSelectedTag(tag);
  }

  function handleRemoveTagFilter() {
    setSelectedTag("");
  }

  useEffect(() => {
    if (artsArray) {
      Promise.all(
        artsArray.map((art) =>
          fetch(`/api/get-art?key=${art.key}`).then((res) => res.json())
        )
      ).then((artsGetUrlArr) => {
        setShownArts(
          artsGetUrlArr.map((art, i) => {
            return {
              ...artsArray[i],
              link: art.url,
            };
          })
        );
      });
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

        <div className="flex flex-1 gap-[12px]">
          <section className="w-[200px]">
            <h3>Selected tag</h3>
            {selectedTag && (
              <span
                className=" rounded border-2 border-zinc-200 bg-slate-100 p-1 text-sm text-slate-600"
                onClick={handleRemoveTagFilter}
              >
                {selectedTag}
              </span>
            )}
            <h3>Tags</h3>
            <div className="flex flex-row flex-wrap gap-2">
              {allTags?.map((tag) => (
                <span
                  className=" rounded border-2 border-zinc-200 bg-slate-100 p-1 text-sm text-slate-600"
                  key={tag}
                  onClick={() => handleTagFilter(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
          <section className=" flex flex-1 flex-wrap content-start items-center gap-3">
            {isSuccess &&
              shownArts?.map((art) => {
                return <ArtCard key={art.id} {...art} />;
              })}
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
