import Image from "next/image";
import { useRef, type PropsWithChildren } from "react";
import { Transition, type TransitionStatus } from "react-transition-group";
import TagsField from "./Tags/TagsField";
import { Inter } from "@next/font/google";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"], weight: "200" });

interface ILeftPanelProps extends PropsWithChildren {
  tags: string[];
  handleRemoveTagFilter: () => void;
  handleAddTagFilter: (tag: string) => void;
  selectedTag: string;
}

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles: Record<TransitionStatus, object> = {
  entering: { opacity: 1, top: "-100px" },
  entered: { opacity: 1 },
  exiting: { opacity: 0, top: "-100px" },
  exited: { opacity: 0 },
  unmounted: {},
};

export default function LeftPanel({
  tags,
  handleRemoveTagFilter,
  selectedTag,
  handleAddTagFilter,
}: ILeftPanelProps) {
  const nodeRef = useRef(null);

  return (
    <section
      className={` flex flex-col gap-5 text-sm transition-all max-smartphone:w-full max-smartphone:items-center smartphone:w-[200px] ${inter.className}`}
    >
      <header className="flex min-h-min items-center max-smartphone:mt-3 max-smartphone:w-full max-smartphone:pl-5 smartphone:mt-10 smartphone:justify-center">
        <Image
          src="/assets/images/Logo.png"
          width={400}
          height={400}
          alt="Neznayer logo"
          className="h-auto w-[150px] rounded-full max-smartphone:w-[32px] "
        />
        <h1
          className={`${inter.className} ml-5 hidden text-lg max-smartphone:block`}
        >
          Neznayer art
        </h1>
      </header>
      <Transition nodeRef={nodeRef} in={!!selectedTag} timeout={500}>
        {(state) => (
          <div
            style={{ ...defaultStyle, ...transitionStyles[state] }}
            ref={nodeRef}
            className="flex flex-col gap-2 max-smartphone:hidden"
          >
            <h3>Selected tag</h3>
            <TagsField
              tags={[selectedTag]}
              onTagClick={handleRemoveTagFilter}
              mode="control"
            />
          </div>
        )}
      </Transition>

      <TagsField
        tags={tags || []}
        onTagClick={handleAddTagFilter}
        mode="view"
      />
      <section className="flex flex-1 flex-col items-center justify-end">
        <Footer />
      </section>
    </section>
  );
}
