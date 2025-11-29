import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}

const PanelFooter = React.forwardRef<HTMLDivElement, PanelFooterProps>(
  ({ className, separator = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          separator && "border-t border-border pt-4 mt-4",
          className
        )}
        {...props}
      />
    );
  }
);
PanelFooter.displayName = "PanelFooter";

export { PanelFooter };

