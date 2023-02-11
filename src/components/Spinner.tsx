import styles from "./spinner.module.sass";

export default function Spinner({ className }: { className: string }) {
  return <span className={`${styles.loader} ${className}`}></span>;
}
