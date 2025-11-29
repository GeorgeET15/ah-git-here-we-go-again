import { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon } from "lucide-react";
import { CommandSuggestion } from "@/hooks/useCommandSuggestions";
import { TerminalLine } from "@/game/state/types";
import { useTerminalLines, useGameStore } from "@/game/state/selectors";
import { useSettingsStore } from "@/game/state/settingsStore";

interface GuidedTerminalProps {
  suggestions: CommandSuggestion[];
  onCommand: (command: string) => void;
  lines?: TerminalLine[]; // Optional - if not provided, uses global store
  prompt?: string;
  useGlobalStore?: boolean; // Use global store for terminal lines
}

export const GuidedTerminal = ({
  suggestions,
  onCommand,
  lines: propLines,
  prompt,
  useGlobalStore = true,
}: GuidedTerminalProps) => {
  // Get username from settings store (playerName) or use default
  const { playerName } = useSettingsStore();
  const username = (playerName || "user").toLowerCase();
  
  // Simple prompt: username@root
  const defaultPrompt = `${username}@root`;
  const terminalPrompt = prompt || defaultPrompt;
  const globalLines = useTerminalLines();
  const { addTerminalLine } = useGameStore();
  
  // Use global store lines if useGlobalStore is true, otherwise use prop lines
  const lines = useGlobalStore ? globalLines : (propLines || []);
  
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new lines appear
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim();
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command to terminal (if using global store)
    if (useGlobalStore) {
      addTerminalLine({ type: "command", text: command });
    }
    
    onCommand(command);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const handleSuggestionClick = (command: string) => {
    setInput(command);
    inputRef.current?.focus();
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case "command":
        return "text-primary";
      case "error":
        return "text-error";
      case "success":
        return "text-success";
      default:
        return "text-terminal-text";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Command Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 bg-muted/30 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion.command)}
                className="px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-xs font-mono text-primary transition-colors animate-fade-in"
                title={suggestion.hint}
              >
                {suggestion.command}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto terminal-panel p-4 font-mono text-sm"
      >
        <div className="space-y-1">
          {lines.map((line, idx) => (
            <div key={idx} className={`${getLineColor(line.type)} animate-fade-in`}>
              {line.type === "command" && (
                <>
                  <span className="text-accent-cyan mr-1 font-semibold">{terminalPrompt}:</span>
                  <span className="text-muted-foreground mr-2">$</span>
                </>
              )}
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="border-t border-border bg-background">
        <div className="flex items-center px-4 py-3 gap-2">
          <span className="text-accent-cyan font-mono text-sm font-semibold">{terminalPrompt}:</span>
          <span className="text-muted-foreground font-mono text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground"
            placeholder=""
            autoFocus
          />
          <div className="w-2 h-4 bg-accent-cyan animate-pulse" />
        </div>
      </form>
    </div>
  );
};

// Re-export TerminalLine type for backward compatibility
export type { TerminalLine } from "@/game/state/types";
