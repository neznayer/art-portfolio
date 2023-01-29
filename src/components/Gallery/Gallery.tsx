import { type PropsWithChildren } from "react";
import styles from "./Gallery.module.css";

export default function Gallery({ children }: PropsWithChildren) {
  return <section className={styles.gallery}>{children}</section>;
}
