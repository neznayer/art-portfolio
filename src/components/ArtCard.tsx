import Image from "next/image";
import { type IArt } from "../types/art";
import styles from "./art-card.module.css";

export default function ArtCard({ title, link, width, height }: IArt) {
  return (
    <div className={styles.container}>
      <Image
        alt={title || ""}
        src={link || ""}
        width={width}
        height={height}
        className={styles.image}
      ></Image>
      <h3>{title}</h3>
    </div>
  );
}
