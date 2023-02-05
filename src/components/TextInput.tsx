import { type InputHTMLAttributes } from "react";

interface ITextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export default function TextInput({ className, ...props }: ITextInputProps) {
  return (
    <input
      type="text"
      {...props}
      className={`text-md border-[1px] border-slate-200 py-2 px-5 rounded-md${className}`}
    ></input>
  );
}
