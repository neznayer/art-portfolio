import { type NextPage } from "next";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { api } from "../utils/api";
import { useEffect, useState, useRef } from "react";
import { type IArt } from "../types/art";
import TagsField from "../components/Tags/TagsField";
import { Transition, type TransitionStatus } from "react-transition-group";
import GalleryItem from "../components/Gallery/GalleryItem";
const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: Record<TransitionStatus, object> = {
  entering: { opacity: 1, top: "-100px" },
  entered: { opacity: 1 },
  exiting: { opacity: 0, top: "-100px" },
  exited: { opacity: 0 },
  unmounted: {},
};

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Home: NextPage = () => {
  const nodeRef = useRef(null);
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
          <section
            className={` flex w-[200px] flex-col gap-5 text-sm transition-all ${inter.className}`}
          >
            <Transition nodeRef={nodeRef} in={!!selectedTag} timeout={500}>
              {(state) => (
                <div
                  style={{ ...defaultStyle, ...transitionStyles[state] }}
                  ref={nodeRef}
                  className="flex flex-col gap-2"
                >
                  <h3>Selected tag</h3>
                  <TagsField
                    tags={[selectedTag]}
                    onTagClick={handleRemoveTagFilter}
                    mode="control"
                  />
                </div>
              )}
            </Transition>

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
                  return <GalleryItem key={art.id} {...art} mode="view" />;
                })}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
