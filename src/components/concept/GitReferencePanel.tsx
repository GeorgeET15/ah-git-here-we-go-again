import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Copy, Check } from "lucide-react";
import { gitCommands, GitCommand } from "@/utils/gitCommands";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GitReferencePanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const GitReferencePanel = ({
  open,
  onOpenChange,
}: GitReferencePanelProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const filteredCommands = gitCommands.filter(
    (cmd) =>
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, GitCommand[]>);

  const categoryLabels: Record<string, string> = {
    basics: "Basic Commands",
    branching: "Branching",
    merging: "Merging",
    advanced: "Advanced",
  };

  return (
    <TooltipProvider>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" data-tour="reference">
                <BookOpen className="w-4 h-4" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view commands to try them (Press ?)</p>
          </TooltipContent>
        </Tooltip>
         <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
           <SheetHeader>
             <SheetTitle className="flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-primary" />
               Git Command Reference
             </SheetTitle>
             <SheetDescription>
               Browse and copy Git commands to try in the terminal. Press ? to toggle this panel.
             </SheetDescription>
           </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Command Groups */}
            {Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">
                  {categoryLabels[category] || category}
                </h3>
                <div className="space-y-3">
                  {commands.map((cmd, idx) => {
                    const globalIndex = gitCommands.indexOf(cmd);
                    return (
                      <div key={idx} className="panel p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-sm font-mono text-primary flex-1">
                            {cmd.command}
                          </code>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {cmd.description}
                        </p>
                        <div className="terminal-panel p-2 mt-2 flex items-center justify-between gap-2">
                          <code className="text-xs text-terminal-text flex-1">
                            {cmd.example}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              handleCopy(cmd.example, globalIndex + 1000)
                            }
                          >
                            {copiedIndex === globalIndex + 1000 ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No commands found
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">
              ?
            </kbd>{" "}
            to toggle this panel
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};
