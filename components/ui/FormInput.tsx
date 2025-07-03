import { ChangeEvent, HTMLInputAutoCompleteAttribute } from "react";

type FormInputProps = {
  label: string;
  type: "email" | "password" | "text" | "number";
  autoComplete?: HTMLInputAutoCompleteAttribute;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  required?: boolean;
  placeholder?: string;
  name?: string;
};

export default function FormInput({
  label,
  type,
  autoComplete,
  onChange,
  value,
  required,
  placeholder,
  name,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" htmlFor="">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        autoComplete={autoComplete}
        className="px-2 py-2 rounded outline-none border hover:border-[#1c2841]"
        type={type}
        name={name}
      />
    </div>
  );
}
