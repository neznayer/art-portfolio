import { Inter } from "@next/font/google";
import { type PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"], weight: "200" });

export default function ViewLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex flex-col justify-start gap-4">
      <header className="flex h-[100px] items-center justify-center text-xl">
        <h1 className={`${inter.className} inline-block`}>
          Neznayer Art portfolio
        </h1>
      </header>
      {children}
    </main>
  );
}
