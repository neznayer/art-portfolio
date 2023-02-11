import Link from "next/link";
import { type IArt } from "../../types/art";
import GalleryItem from "./GalleryItem";

interface IGalleryProps {
  arts: IArt[];
  mode?: "control" | "view" | "large_view";
}

export default function Gallery({ arts, mode }: IGalleryProps) {
  return (
    <section className=" w-full gap-[2vw] max-tabletBig:columns-1 tabletBig:columns-2 desktop:columns-3 ">
      {arts.map((art) => {
        return (
          <Link key={art.id} href={`/art/${art.id}`} className="block">
            <GalleryItem
              key={art.id}
              {...art}
              mode={mode || "view"}
              className="mb-[2vw] h-full"
            />
          </Link>
        );
      })}
    </section>
  );
}
