import { TerminalLine } from "@/game/state/types";
import { useGameStore } from "@/game/state/gameStore";

export interface CommandContext {
  act: number;
  step: string;
  terminalLines: TerminalLine[];
}

export interface CommandResult {
  success: boolean;
  message?: string;
  lines?: TerminalLine[];
  nextStep?: string;
  showConcept?: string;
}

export type CommandHandler = (
  command: string,
  context: CommandContext
) => CommandResult | null;

// Command registry
const commandHandlers: Map<string, CommandHandler> = new Map();

/**
 * Register a command handler
 */
export const registerCommand = (
  pattern: string | RegExp,
  handler: CommandHandler
) => {
  if (typeof pattern === "string") {
    commandHandlers.set(pattern, handler);
  } else {
    // For regex patterns, store with a key
    commandHandlers.set(pattern.toString(), handler);
  }
};

/**
 * Execute a command and return the result
 */
export const executeCommand = (
  command: string,
  context: CommandContext
): CommandResult | null => {
  const trimmed = command.trim();
  
  // Try exact match first
  const exactHandler = commandHandlers.get(trimmed);
  if (exactHandler) {
    return exactHandler(trimmed, context);
  }

  // Try pattern matching
  for (const [pattern, handler] of commandHandlers.entries()) {
    try {
      const regex = new RegExp(pattern);
      if (regex.test(trimmed)) {
        const result = handler(trimmed, context);
        if (result) return result;
      }
    } catch {
      // Not a regex, skip
    }
  }

  // Try prefix matching (e.g., "git commit" matches "git commit -m ...")
  for (const [pattern, handler] of commandHandlers.entries()) {
    if (trimmed.startsWith(pattern)) {
      const result = handler(trimmed, context);
      if (result) return result;
    }
  }

  return null;
};

/**
 * Create terminal lines from command result
 */
export const createTerminalLines = (result: CommandResult): TerminalLine[] => {
  const lines: TerminalLine[] = [];
  
  if (result.lines) {
    lines.push(...result.lines);
  } else if (result.message) {
    lines.push({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  }

  return lines;
};


