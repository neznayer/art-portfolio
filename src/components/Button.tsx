import { type PropsWithChildren } from "react";

interface IButtonProps extends PropsWithChildren {
  onClick: () => void;
}
export default function Button({ children, onClick }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className="block rounded border-2 border-slate-200 p-2 shadow-md"
    >
      {children}
    </button>
  );
}
