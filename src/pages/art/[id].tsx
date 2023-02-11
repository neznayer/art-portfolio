import superjson from "superjson";
import GalleryItem from "../../components/Gallery/GalleryItem";
import TagsField from "../../components/Tags/TagsField";
import LargeViewLayout from "../../components/LargeViewLayout";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { artRouter } from "../../server/api/routers/art";
import { createInnerTRPCContext } from "../../server/api/trpc";
import { type Art } from "@prisma/client";

export default function ArtById({ art }: { art: Art }) {
  //const { data, isFetched } = api.art.getById.useQuery({ id });

  return (
    <>
      <Head>
        <title>{`Neznayer art portfolio: ${art?.title}`}</title>
      </Head>
      <Link
        className="absolute left-5 top-5 cursor-pointer text-3xl text-dark-gray"
        href="/"
      >
        <FaAngleLeft />
      </Link>
      <section className="flex w-full flex-col items-center justify-center">
        <LargeViewLayout className=" mt-8 bg-white" mode="large">
          <GalleryItem
            mode="large_view"
            {...art}
            className=" w-[50vw] max-smartphone:w-full"
          />

          <dl>
            <dt>
              <h2 className="text-left text-lg">{art?.title}</h2>
            </dt>
            <dd>
              <h3>{art?.description}</h3>
            </dd>
          </dl>

          <TagsField
            onTagClick={() => null}
            mode="largeView"
            tags={art?.tags || []}
          />
        </LargeViewLayout>
      </section>
    </>
  );
}

export async function getStaticPaths() {
  const ssg = createProxySSGHelpers({
    router: artRouter,
    ctx: createInnerTRPCContext({ session: null }),
  });

  const allArts = await ssg.allArts.fetch();

  const paths = allArts.map((art) => ({
    params: { id: art.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const ssg = createProxySSGHelpers({
    router: artRouter,
    ctx: createInnerTRPCContext({ session: null }),
    transformer: superjson,
  });

  const { id } = params;

  const art = await ssg.getById.fetch({ id });

  return {
    props: {
      art: {
        ...art,
        createdAt: art?.createdAt.valueOf(),
        updatedAt: art?.updatedAt.valueOf(),
      },
    },
  };
}
