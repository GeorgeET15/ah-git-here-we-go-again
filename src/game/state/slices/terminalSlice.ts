import type { StateCreator } from "zustand";
import type { TerminalLine } from "../types";

/**
 * TerminalSlice
 * - Shared guided terminal output for acts
 * - Kept flat for backward compatibility (terminalLines, addTerminalLine, clearTerminal)
 */

export interface TerminalSliceState {
  terminalLines: TerminalLine[];
}

export interface TerminalSliceActions {
  addTerminalLine: (line: TerminalLine) => void;
  clearTerminal: () => void;
}

export type TerminalSlice = TerminalSliceState & TerminalSliceActions;

export const createTerminalSlice: StateCreator<any, [], [], TerminalSlice> = (
  set
) => ({
  terminalLines: [],

  addTerminalLine: (line: TerminalLine) =>
    set((state: any) => ({
      terminalLines: [...state.terminalLines, line],
    })),

  clearTerminal: () => set({ terminalLines: [] }),
});


