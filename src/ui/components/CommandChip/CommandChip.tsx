import * as React from "react";
import { cn } from "@/lib/utils";

export interface CommandChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  command: string;
  hint?: string;
  active?: boolean;
}

const CommandChip = React.forwardRef<HTMLButtonElement, CommandChipProps>(
  ({ className, command, hint, active = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-mono transition-colors",
          "bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary",
          active && "bg-primary/20 border-primary/50",
          "animate-fade-in",
          className
        )}
        title={hint}
        {...props}
      >
        {command}
      </button>
    );
  }
);
CommandChip.displayName = "CommandChip";

export { CommandChip };

