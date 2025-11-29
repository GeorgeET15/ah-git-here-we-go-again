import * as React from "react";
import { cn } from "@/lib/utils";

export interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}

const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ className, separator = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5",
          separator && "border-b border-border pb-4 mb-4",
          className
        )}
        {...props}
      />
    );
  }
);
PanelHeader.displayName = "PanelHeader";

export { PanelHeader };

