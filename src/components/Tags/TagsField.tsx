import Tag from "./Tag";

interface ITagsFieldProps {
  tags: string[];
  mode: "control" | "view";
  onTagClick: (tag: string) => void;
}

export default function TagsField({ mode, tags, onTagClick }: ITagsFieldProps) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
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
