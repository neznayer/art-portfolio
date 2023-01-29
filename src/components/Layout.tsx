import Head from "next/head";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import styles from "./Layout.module.css";

interface ILayoutProps extends PropsWithChildren {
  place: "admin" | "home" | undefined;
}
const siteTitle = "Neznayer Art portfolio";

export default function Layout({ children, place }: ILayoutProps) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />

        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main>{children}</main>
      {place !== "home" && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}
    </div>
  );
}
