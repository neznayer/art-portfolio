import { type NextPage } from "next";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { api } from "../utils/api";
import ArtCard from "../components/ArtCard";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Home: NextPage = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const { data: artsArray, isSuccess } = api.art.highlightedArts.useQuery({
    tag: selectedTag,
  });

  function handleTagFilter(tag: string) {
    setSelectedTag(tag);
  }

  function handleRemoveTagFilter() {
    setSelectedTag("");
  }

  useEffect(() => {
    if (selectedTag) {
      setTags([selectedTag]);
    } else {
      const uniqueTags = [...new Set(artsArray?.flatMap((art) => art.tags))];
      setTags(uniqueTags);
    }
  }, [artsArray, selectedTag]);

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
              {tags.map((tag) => (
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
              artsArray?.map((art) => {
                return <ArtCard key={art.id} {...art} />;
              })}
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
