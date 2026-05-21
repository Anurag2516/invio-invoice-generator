import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = "", ...rest }, inputRef) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wide text-stone-600">
            {label}
          </label>
        )}

        <input
          ref={inputRef}
          {...rest}
          className={`
                h-11 w-full rounded-lg border bg-white px-3.5
                text-sm text-stone-800 shadow-sm outline-none
                transition-all duration-200
    placeholder:text-stone-400
    hover:border-stone-400
    focus:border-green-500 focus:ring-2 focus:ring-green-500/10
    disabled:cursor-not-allowed disabled:bg-stone-50 disabled:opacity-50
    ${error ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10" : "border-stone-200"}
    ${className}
  `}
        />

        {error && <span className="text-[10px] text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
