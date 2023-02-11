import Tag from "./Tag";

export interface ITagsFieldProps {
  tags: string[];
  mode: "control" | "view" | "largeView";
  onTagClick: (tag: string) => void;
  className?: string;
}

export default function TagsField({
  mode,
  tags,
  onTagClick,
  className,
}: ITagsFieldProps) {
  return (
    <div
      className={`${
        mode === "view" ? "hidden smartphone:flex" : "flex"
      } flex-row flex-wrap gap-2 smartphone:flex ${className}`}
    >
      <h3>Tags</h3>
      {tags.map((tag) => {
        return (
          <Tag
            key={tag}
            tag={tag}
            mode={mode}
            onClick={() => onTagClick(tag)}
          />
        );
      })}
    </div>
  );
}
