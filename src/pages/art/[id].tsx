import { useRouter } from "next/router";
import { api } from "../../utils/api";

import GalleryItem from "../../components/Gallery/GalleryItem";
import TagsField from "../../components/Tags/TagsField";
import ViewLayout from "../../components/ViewLayout";

export default function ArtById() {
  const router = useRouter();

  const id = router.query.id as string;

  const { data, isFetched } = api.art.getById.useQuery({ id });

  return (
    <ViewLayout>
      <section className=" my-0 mx-auto flex w-full flex-col items-center justify-center">
        {isFetched && (
          <>
            <GalleryItem mode="large_view" {...data} className="h-[500px]" />

            <h1 className="text-left text-lg">{data?.title}</h1>
            <h2>{data?.description}</h2>
            <TagsField
              onTagClick={() => null}
              mode="view"
              tags={data?.tags || []}
            />
          </>
        )}
      </section>
    </ViewLayout>
  );
}
