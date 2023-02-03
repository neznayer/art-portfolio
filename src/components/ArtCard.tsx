import Image from "next/image";
import styles from "./art-card.module.css";
interface IArtProps {
  link: string;
  title: string;
  tags: string[];
  description: string;
  width: number;
  height: number;
  highlight?: boolean;
}

export default function ArtCard({
  title,
  link,
  width,
  height,
  highlight,
}: IArtProps) {
  return (
    <div className={styles.container}>
      <Image
        alt={title}
        src={link}
        width={width}
        height={height}
        className={styles.image}
      ></Image>
      <h3>{title}</h3>
    </div>
  );
}
