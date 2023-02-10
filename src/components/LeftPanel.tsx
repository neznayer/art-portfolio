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
      className={` flex w-[200px] flex-col gap-5 text-sm transition-all max-smartphone:items-center ${inter.className}`}
    >
      <header className="mt-10 flex min-h-min items-center justify-center">
        <Image
          src="/assets/images/Logo.png"
          width={400}
          height={400}
          alt="Neznayer logo"
          className="h-auto w-[150px] rounded-full"
        />
      </header>
      <Transition nodeRef={nodeRef} in={!!selectedTag} timeout={500}>
        {(state) => (
          <div
            style={{ ...defaultStyle, ...transitionStyles[state] }}
            ref={nodeRef}
            className="flex flex-col gap-2"
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

      <h3>Tags</h3>
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
