import { type PropsWithChildren } from "react";

export default function ViewLayout({ children }: PropsWithChildren) {
  return <main className="sm flex justify-start gap-4 pl-5">{children}</main>;
}
