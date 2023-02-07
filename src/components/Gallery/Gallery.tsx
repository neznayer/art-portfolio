import { type PropsWithChildren } from "react";

export default function Gallery({ children }: PropsWithChildren) {
  return (
    <section className="flex max-w-[36rem] flex-wrap gap-4">{children}</section>
  );
}
