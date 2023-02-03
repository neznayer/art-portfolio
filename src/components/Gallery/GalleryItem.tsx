import Image from "next/image";
import styles from "./GalleryItem.module.css";
import { FaHeart, FaTimes } from "react-icons/fa";
import { type IArt } from "../../types/art";

interface GalleryItemProps {
  art: IArt;
  onDelete: (link: string) => void;
  onAddHighlight: (id: string, highlight: boolean) => void;
  admin: boolean;
}

export default function GalletyItem({
  art,
  onDelete,
  onAddHighlight,
}: GalleryItemProps) {
  return (
    <div className={styles.item}>
      <Image
        src={art.link}
        alt={art.description}
        width={art.width}
        height={art.height}
      />

      <div className={styles["delete-btn"]}>
        <FaTimes onClick={() => onDelete(art.id)} />
      </div>

      <div
        onClick={() => onAddHighlight(art.id, !art.highlight)}
        className={`absolute top-3 left-3 cursor-pointer hover:text-red-600 ${
          art.highlight && " text-red-400 "
        }`}
      >
        <FaHeart />
      </div>
    </div>
  );
}
