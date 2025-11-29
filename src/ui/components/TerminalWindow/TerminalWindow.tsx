import * as React from "react";
import { cn } from "@/lib/utils";
import { Panel } from "../Panel";

export interface TerminalWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  persistent?: boolean;
}

const TerminalWindow = React.forwardRef<HTMLDivElement, TerminalWindowProps>(
  ({ className, height, persistent = false, children, ...props }, ref) => {
    const heightStyle = typeof height === "number" ? `${height}px` : height;

    return (
      <Panel
        ref={ref}
        variant="default"
        padding="none"
        className={cn(
          "flex flex-col overflow-hidden",
          persistent && "border-t-2 border-primary/20",
          className
        )}
        style={height ? { height: heightStyle } : undefined}
        {...props}
      >
        {children}
      </Panel>
    );
  }
);
TerminalWindow.displayName = "TerminalWindow";

export { TerminalWindow };

