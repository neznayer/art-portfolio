import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import ArtCard from "../components/ArtCard";

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
      <main className={styles.main}>
        <ul>
          {isSuccess &&
            artsArray?.map((art) => {
              return <ArtCard key={art.id} {...art} />;
            })}
        </ul>
      </main>
    </>
  );
};

export default Home;
