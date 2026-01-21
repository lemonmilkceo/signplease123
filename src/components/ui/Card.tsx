import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "filled";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card border border-border shadow-card",
      outline: "bg-transparent border border-border",
      filled: "bg-secondary border-none",
    };

    return (
      <div
        ref={ref}
        className={`rounded-2xl p-5 ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
