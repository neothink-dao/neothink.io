import * as React from "react";

// Simple cn utility for className concatenation
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "secondary";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
          variant === "default" && "bg-primary text-primary-foreground",
          variant === "outline" && "border border-input bg-background",
          variant === "secondary" && "bg-secondary text-secondary-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge"; 