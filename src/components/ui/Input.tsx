import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-caption text-muted-foreground mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-4 rounded-xl border bg-background text-foreground text-body-lg
            placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring
            transition-all duration-200 touch-target
            ${error ? "border-destructive" : "border-input"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-2 text-caption text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
