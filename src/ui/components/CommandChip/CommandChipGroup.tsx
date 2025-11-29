import * as React from "react";
import { cn } from "@/lib/utils";
import { CommandChip } from "./CommandChip";

export interface CommandChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  commands: Array<{ command: string; hint?: string }>;
  onCommandClick?: (command: string) => void;
}

const CommandChipGroup = React.forwardRef<HTMLDivElement, CommandChipGroupProps>(
  ({ className, commands, onCommandClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "p-3 bg-muted/30 border-b border-border",
          className
        )}
        {...props}
      >
        <div className="flex flex-wrap gap-2">
          {commands.map((cmd, idx) => (
            <CommandChip
              key={idx}
              command={cmd.command}
              hint={cmd.hint}
              onClick={() => onCommandClick?.(cmd.command)}
            />
          ))}
        </div>
      </div>
    );
  }
);
CommandChipGroup.displayName = "CommandChipGroup";

export { CommandChipGroup };

