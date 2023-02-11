import { FaTimes } from "react-icons/fa";
import { type ITagsFieldProps } from "./TagsField";

interface ITagProps {
  tag: string;
  mode: ITagsFieldProps["mode"];
  onClick?: () => void;
  onDelete?: () => void;
}
export default function Tag({ tag, mode, onClick }: ITagProps) {
  if (mode === "control") {
    return (
      <span className=" select-none rounded border-[1px] border-zinc-200 bg-slate-100 p-1 text-xs text-slate-600 hover:bg-slate-50">
        <span>{tag}</span>
        <FaTimes
          onClick={onClick}
          className="inline cursor-pointer text-slate-600"
        />
      </span>
    );
  }
  return (
    <span
      className=" cursor-pointer select-none rounded border-[1px] border-zinc-200 bg-slate-100 p-1 text-xs text-slate-600 hover:bg-slate-50"
      onClick={onClick}
    >
      {tag}
    </span>
  );
}
