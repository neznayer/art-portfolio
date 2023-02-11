import { type PropsWithChildren } from "react";

export default function ViewLayout({ children }: PropsWithChildren) {
  return (
    <main
      className="flex
     gap-4 
     pl-5 
     max-desktop:justify-start 
     max-tablet:flex-row
     max-smartphone:flex-col 
     max-smartphone:items-center 
     max-smartphone:pl-0
     "
    >
      {children}
    </main>
  );
}
