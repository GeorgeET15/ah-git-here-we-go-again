import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const PanelContent = React.forwardRef<HTMLDivElement, PanelContentProps>(
  ({ className, padding = "md", ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-3",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(paddingClasses[padding], className)}
        {...props}
      />
    );
  }
);
PanelContent.displayName = "PanelContent";

export { PanelContent };

