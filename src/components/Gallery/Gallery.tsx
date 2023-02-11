import { type IArt } from "../../types/art";
import GalleryItem from "./GalleryItem";

interface IGalleryProps {
  arts: IArt[];
  mode?: "control" | "view" | "large_view";
  onDelete?: (key: string) => void;
  onAddHighlight?: (key: string, highlight: boolean) => void;
}

export default function Gallery({
  arts,
  mode,
  onAddHighlight,
  onDelete,
}: IGalleryProps) {
  return (
    <section className=" w-full gap-[2vw] max-tabletBig:columns-1 tabletBig:columns-2 desktop:columns-3 ">
      {arts.map((art) => {
        return (
          <GalleryItem
            key={art.id}
            {...art}
            mode={mode || "view"}
            className="mb-[2vw]"
            onDelete={onDelete}
            onHighlight={onAddHighlight}
          />
        );
      })}
    </section>
  );
}
