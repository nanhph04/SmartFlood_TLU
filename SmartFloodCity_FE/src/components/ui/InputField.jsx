import { useState } from "react";

export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  leftIcon,
  className = "",
}) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-xs font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={
            "w-full py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 " +
            "text-sm text-slate-900 placeholder-slate-400 " +
            "focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent " +
            (leftIcon ? "pl-9 pr-9" : "px-3")
          }
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-500 text-xs"
          >
            {show ? "Ẩn" : "Hiện"}
          </button>
        )}
      </div>
    </div>
  );
}
