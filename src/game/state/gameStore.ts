import { create } from "zustand";
import { persist } from "zustand/middleware";
import { levels as initialLevels } from "@/data/levels";
import type { GameState } from "./types";
import { createNavigationSlice, type NavigationSlice } from "./slices/navigationSlice";
import { createProgressionSlice, type ProgressionSlice } from "./slices/progressionSlice";
import { createTerminalSlice, type TerminalSlice } from "./slices/terminalSlice";
import { createLessonSlice, type LessonSlice } from "./slices/lessonSlice";
import { createUISlice, type UISlice } from "./slices/uiSlice";
import { createSandboxSlice, type SandboxSlice } from "./slices/sandboxSlice";
import { createChallengeSlice, type ChallengeSlice } from "./slices/challengeSlice";

/**
 * Root GameStore type
 * - Composed from domain slices
 * - Kept backward-compatible: fields & actions remain at the top level
 */

export interface GameStore
  extends GameState,
    NavigationSlice,
    ProgressionSlice,
    TerminalSlice,
    LessonSlice,
    UISlice,
    SandboxSlice,
    ChallengeSlice {
  reset: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Slices (order matters where initial values overlap; navigation/progression set first)
      ...createNavigationSlice(set, get, {} as any),
      ...createProgressionSlice(set, get, {} as any),
      ...createTerminalSlice(set, get, {} as any),
      ...createLessonSlice(set, get, {} as any),
      ...createUISlice(set, get, {} as any),
      ...createSandboxSlice(set, get, {} as any),
      ...createChallengeSlice(set, get, {} as any),

      // Root-level reset (reset slices to initial values)
      reset: () =>
        set(() => ({
          // Navigation
          screen: "home",
          actState: "idle",
          // Progression
          levels: initialLevels,
          currentLevelId: null,
          completedActs: [],
          modeUnlocked: {
            sandbox: false,
            challenge: false,
          },
          // Terminal
          terminalLines: [],
          // Lesson
          currentLessonStep: null,
          // UI
          showConceptPanel: false,
          editorContent: "",
          timelineState: {},
          // Sandbox
          sandboxRepo: null,
          // Challenge
          currentScenarioId: null,
          currentScore: 0,
          results: [],
        })),
    }),
    {
      name: "ah-git-progress",
      partialize: (state) => {
        // Only persist user progress, not static game data
        // Store only unlocked status for levels (not full definitions)
        const levelUnlocks = state.levels.map(level => ({
          id: level.id,
          unlocked: level.unlocked,
        }));
        
        return {
          // User progress
          completedActs: state.completedActs,
          actState: state.actState,
          modeUnlocked: state.modeUnlocked,
          currentLevelId: state.currentLevelId,
          // Only store unlock status, not full level definitions
          levelUnlocks,
        };
      },
      // Custom merge to restore level unlocks without overwriting level definitions
      merge: (persistedState: any, currentState: any) => {
        // Restore level unlocks from persisted state
        if (persistedState?.levelUnlocks) {
          const updatedLevels = currentState.levels.map((level: any) => {
            const persistedLevel = persistedState.levelUnlocks.find((l: any) => l.id === level.id);
            return persistedLevel ? { ...level, unlocked: persistedLevel.unlocked } : level;
          });
          return {
            ...currentState,
            ...persistedState,
            levels: updatedLevels,
          };
        }
        return { ...currentState, ...persistedState };
      },
      version: 3, // Bump version to trigger migration
    }
  )
);

