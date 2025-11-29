import type { StateCreator } from "zustand";

/**
 * SandboxSlice
 * - Placeholder for free-play Git sandbox state
 * - Currently minimal and not yet wired to UI; safe for future expansion
 */

export interface SandboxRepoState {
  // Minimal shape for now; can be expanded with real Git structures later
  branches: string[];
  currentBranch: string;
  commits: { id: string; message: string; branch: string }[];
}

export interface SandboxSliceState {
  sandboxRepo: SandboxRepoState | null;
}

export interface SandboxSliceActions {
  initSandboxRepo: () => void;
  resetSandboxRepo: () => void;
}

export type SandboxSlice = SandboxSliceState & SandboxSliceActions;

export const createSandboxSlice: StateCreator<any, [], [], SandboxSlice> = (
  set
) => ({
  sandboxRepo: null,

  initSandboxRepo: () =>
    set(() => ({
      sandboxRepo: {
        branches: ["main"],
        currentBranch: "main",
        commits: [],
      },
    })),

  resetSandboxRepo: () =>
    set(() => ({
      sandboxRepo: null,
    })),
});


