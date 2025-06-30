import { InputHTMLAttributes } from "react";

interface InputProps {
  errors?: string[];
  name: string;
  labelText?: string;
}

export default function Input({
  name,
  errors = [],
  labelText,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      {labelText && (
        <label htmlFor={name} className="text-white text-sm">
          {labelText}
        </label>
      )}
      <input
        id={name}
        name={name}
        className="bg-transparent rounded-md w-full
            h-10 focus:outline-none ring-2 focus:ring-4
            transition text-white px-4
            ring-neutral-700 focus:ring-orange-500 border-none
            placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
