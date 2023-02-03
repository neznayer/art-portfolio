import Image from "next/image";
import styles from "./GalleryItem.module.css";
import { FaHeart, FaTimes } from "react-icons/fa";
export interface IArt {
  id: string;
  link: string;
  tags: string[];
  title: string;
  description: string;
  width: number;
  height: number;
  highlight?: boolean;
}

interface GalleryItemProps {
  art: IArt;
  onDelete: (link: string) => void;
  admin: boolean;
}

export default function GalletyItem({
  art,
  admin,
  onDelete,
}: GalleryItemProps) {
  return (
    <div className={styles.item}>
      <Image
        src={art.link}
        alt={art.description}
        width={art.width}
        height={art.height}
      />
      {admin && (
        <div className={styles["delete-btn"]}>
          <FaTimes onClick={() => onDelete(art.id)} />
        </div>
      )}
      {art.highlight && (
        <div className="absolute top-3 left-3 text-red-400">
          <FaHeart />
        </div>
      )}
    </div>
  );
}
