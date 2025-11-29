import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "muted" | "primary" | "success" | "error" | "warning";
  size?: "xs" | "sm" | "base" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold";
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = "default", size = "base", weight = "normal", ...props }, ref) => {
    const variantClasses = {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      success: "text-success",
      error: "text-error",
      warning: "text-warning",
    };

    const sizeClasses = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    };

    const weightClasses = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return (
      <p
        ref={ref}
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          weightClasses[weight],
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text };

