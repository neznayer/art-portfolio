import Link from "next/link";
import { type IArt } from "../../types/art";
import GalleryItem from "./GalleryItem";

interface IGalleryProps {
  arts: IArt[];
}

export default function Gallery({ arts }: IGalleryProps) {
  return (
    <article className="gap-[2vw] sm:columns-2 md:columns-3">
      {arts.map((art) => {
        return (
          <Link key={art.id} href={`/art/${art.id}`} className="block">
            <GalleryItem
              key={art.id}
              {...art}
              mode="view"
              className="mb-[2vw] h-full"
            />
          </Link>
        );
      })}
    </article>
  );
}
