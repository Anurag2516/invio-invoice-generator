import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = "", ...rest }, inputRef) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold uppercase tracking-wide text-stone">
            {label}
          </label>
        )}

        <input
          ref={inputRef}
          {...rest}
          className={cn(
            `h-11 w-full rounded-lg border bg-background dark:bg-input/30 px-3.5 py-2 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/80 hover:border-ring focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                : "border-input"
            }`,
            className,
          )}
        />
        {error && <p className="text-[10px] text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
