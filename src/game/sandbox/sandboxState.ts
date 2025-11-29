/**
 * Sandbox State Management
 * Zustand store for sandbox mode
 */

import { create } from "zustand";
import { RepositoryState } from "./repoEnvironment";

interface SandboxState {
  // Repository state
  repoState: RepositoryState | null;
  
  // UI state
  currentFile: string | null;
  showHints: boolean;
  selectedBranch: string | null;
  
  // Actions
  setRepoState: (state: RepositoryState) => void;
  setCurrentFile: (path: string | null) => void;
  setShowHints: (show: boolean) => void;
  setSelectedBranch: (branch: string | null) => void;
  reset: () => void;
}

const initialState = {
  repoState: null,
  currentFile: null,
  showHints: true,
  selectedBranch: null,
};

export const useSandboxStore = create<SandboxState>((set) => ({
  ...initialState,

  setRepoState: (state) => set({ repoState: state }),
  
  setCurrentFile: (path) => set({ currentFile: path }),
  
  setShowHints: (show) => set({ showHints: show }),
  
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  
  reset: () => set(initialState),
}));

