import Image from "next/image";
import { FaHeart, FaTimes } from "react-icons/fa";
import { type IArt } from "../../types/art";
import styles from "./GalleryItem.module.css";

interface IArtProps extends IArt {
  mode: "view" | "control" | "large_view";
  onDelete?: (id: string) => void;
  onHighlight?: (id: string, highlight: boolean) => void;
  className?: string;
}

export default function ArtCard({
  mode,
  onDelete,
  onHighlight,
  className,
  ...artProps
}: IArtProps) {
  function handleDelete(id: string | undefined) {
    if (onDelete && id) {
      onDelete(id);
    }
  }
  function handleHighlight(id: string | undefined, highlight: boolean) {
    if (onHighlight && id) {
      onHighlight(id, highlight);
    }
  }
  if (mode === "control") {
    return (
      <div className={`relative ${className}`}>
        <Image
          alt={artProps.title || ""}
          src={artProps.link || ""}
          width={artProps.width}
          height={artProps.height}
          className="max-h-full w-auto max-w-full object-cover"
        ></Image>
        <h3>{artProps.title}</h3>
        <FaHeart
          className={`absolute top-2 left-2 cursor-pointer ${
            artProps.highlight && "text-red-400"
          }`}
          onClick={() => handleHighlight(artProps.id, !artProps.highlight)}
        />
        <FaTimes
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => handleDelete(artProps.id)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${className} ${
        mode === "large_view" ? "" : "-hover"
      }`}
    >
      <Image
        alt={artProps.title || ""}
        src={artProps.link || ""}
        width={artProps.width}
        height={artProps.height}
        className={`h-full w-full object-cover`}
      ></Image>
      <h3>{artProps.title}</h3>
    </div>
  );
}
