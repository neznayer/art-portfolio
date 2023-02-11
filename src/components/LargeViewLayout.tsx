import { type PropsWithChildren } from "react";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "200" });

interface ILargeViewLayoutProps extends PropsWithChildren {
  className?: string;
  mode?: string;
}
export default function LargeViewLayout({
  children,
  mode,
  className,
}: ILargeViewLayoutProps) {
  return (
    <section
      className={`flex flex-1 flex-col  overflow-auto bg-bg-gray max-smartphone:w-full ${className}`}
    >
      <div className="flex w-full flex-col gap-2">
        <header
          className={`${inter.className} relative flex h-20 items-center justify-center text-xl max-smartphone:hidden`}
        >
          <h1 className=" block text-center text-dark-gray ">Neznayer art</h1>
        </header>
        <div
          className={` flex flex-wrap justify-center gap-4 px-5 max-smartphone:mt-5 ${
            mode ? "flex-col" : "flex-row"
          } pb-10`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
