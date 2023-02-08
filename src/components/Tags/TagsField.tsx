import Tag from "./Tag";

interface ITagsFieldProps {
  tags: string[];
  mode: "control" | "view";
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
    <div className={`flex flex-row flex-wrap gap-2 ${className}`}>
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
