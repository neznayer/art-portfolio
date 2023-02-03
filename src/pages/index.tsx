import styles from "./index.module.sass";
import { type NextPage } from "next";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { api } from "../utils/api";
import ArtCard from "../components/ArtCard";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Home: NextPage = () => {
  const { data: artsArray, isSuccess } = api.art.allArts.useQuery();

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

        <div className="flex flex-1">
          <section className={`${styles["tags-panel"]}`}></section>
          <section className={styles["images-container"]}>
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
