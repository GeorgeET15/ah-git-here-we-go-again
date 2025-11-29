import * as React from "react";
import { cn } from "@/lib/utils";

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "inline" | "block";
  size?: "sm" | "base" | "lg";
}

const Code = React.forwardRef<HTMLElement, CodeProps>(
  ({ className, variant = "inline", size = "base", ...props }, ref) => {
    const sizeClasses = {
      sm: "text-xs",
      base: "text-sm",
      lg: "text-base",
    };

    if (variant === "block") {
      return (
        <pre
          ref={ref as React.Ref<HTMLPreElement>}
          className={cn(
            "font-mono rounded-md bg-muted p-4 overflow-x-auto",
            sizeClasses[size],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <code
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          "font-mono rounded bg-muted px-1.5 py-0.5",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Code.displayName = "Code";

export { Code };

