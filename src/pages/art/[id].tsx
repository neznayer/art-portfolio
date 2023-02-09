import { useRouter } from "next/router";
import { api } from "../../utils/api";

import GalleryItem from "../../components/Gallery/GalleryItem";
import TagsField from "../../components/Tags/TagsField";
import LargeViewLayout from "../../components/LargeViewLayout";
import { FaAngleLeft } from "react-icons/fa";
import Link from "next/link";
import Head from "next/head";

export default function ArtById() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data, isFetched } = api.art.getById.useQuery({ id });

  return (
    <>
      <Head>
        <title>{`Neznayer art portfolio: ${data?.title}`}</title>
      </Head>
      <Link
        className="absolute left-5 top-5 cursor-pointer text-3xl text-dark-gray"
        href="/"
      >
        <FaAngleLeft />
      </Link>
      <section className="flex w-full flex-col items-center justify-center">
        {isFetched && (
          <LargeViewLayout className=" bg-white" mode="large">
            <GalleryItem mode="large_view" {...data} className="h-[60vh]" />

            <dl>
              <dt>
                <h2 className="text-left text-lg">{data?.title}</h2>
              </dt>
              <dd>
                <h3>{data?.description}</h3>
              </dd>
            </dl>

            <TagsField
              onTagClick={() => null}
              mode="view"
              tags={data?.tags || []}
            />
          </LargeViewLayout>
        )}
      </section>
    </>
  );
}
