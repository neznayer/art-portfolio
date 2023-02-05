import { FaTimes } from "react-icons/fa";

interface ITagProps {
  tag: string;
  mode: "view" | "control";
  onClick?: () => void;
  onDelete?: () => void;
}
export default function Tag({ tag, mode, onClick }: ITagProps) {
  if (mode === "control") {
    return (
      <span className=" rounded border-2 border-zinc-200 bg-slate-100 p-1 text-sm text-slate-600">
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
      className=" cursor-pointer rounded border-2 border-zinc-200 bg-slate-100 p-1 text-sm text-slate-600"
      onClick={onClick}
    >
      {tag}
    </span>
  );
}
