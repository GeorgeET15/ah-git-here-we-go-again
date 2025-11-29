import * as React from "react";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "muted" | "accent";
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, elevation = "md", variant = "default", ...props }, ref) => {
    const elevationClasses = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
    };

    const variantClasses = {
      default: "bg-card",
      muted: "bg-muted/30",
      accent: "bg-primary/5",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-md border border-border",
          variantClasses[variant],
          elevationClasses[elevation],
          className
        )}
        {...props}
      />
    );
  }
);
Surface.displayName = "Surface";

export { Surface };

