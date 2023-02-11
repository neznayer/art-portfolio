import Image from "next/image";
import { FaHeart, FaTimes } from "react-icons/fa";
import { type IArt } from "../../types/art";
import styles from "./GalleryItem.module.sass";

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
          className="max-h-full w-auto max-w-full object-fill"
          sizes="(max-width: 400px) 80vw, (max-width: 600px) 50vw, 33vw"
        ></Image>
        <h3>{artProps.title || ""}</h3>
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
  } else if (mode === "view") {
    return (
      <div
        className={`${styles.container} ${className} ${styles["container-hover"]} relative`}
      >
        <h3 className=" z-10">{artProps.title}</h3>
        <Image
          alt={artProps.title || ""}
          src={artProps.link || ""}
          width={artProps.width}
          height={artProps.height}
          className={`h-auto w-full`}
          sizes="(max-width: 475px) 90vw, (max-width: 640px) 40vw, (max-width: 750px) 30vw, 25vw"
        ></Image>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className} relative`}>
      <h3 className=" z-10">{artProps.title}</h3>
      <Image
        alt={artProps.title || ""}
        src={artProps.link || ""}
        width={artProps.width}
        height={artProps.height}
        className={` h-full w-auto object-cover`}
        sizes="(max-width: 640px) 100wv, 50wv"
      ></Image>
    </div>
  );
}
