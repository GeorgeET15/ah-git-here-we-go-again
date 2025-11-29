import type { StateCreator } from "zustand";
import type { Level } from "@/types/game";
import { levels as initialLevels } from "@/data/levels";

/**
 * ProgressionSlice
 * - Tracks acts completion & level unlocks
 * - Currently mirrors existing behavior from GameStore for compatibility
 */

export interface ProgressionSliceState {
  levels: Level[];
  currentLevelId: number | null;
  completedActs: number[];
  modeUnlocked: {
    sandbox: boolean;
    challenge: boolean;
  };
}

export interface ProgressionSliceActions {
  completeAct: (act: number) => void;
  selectLevel: (levelId: number) => void;
  completeLevel: (levelId: number) => void;
  unlockLevel: (levelId: number) => void;
}

export type ProgressionSlice = ProgressionSliceState & ProgressionSliceActions;

export const createProgressionSlice: StateCreator<
  any,
  [],
  [],
  ProgressionSlice
> = (set, get) => ({
  // Seed with initial levels so behavior matches the previous monolithic store
  levels: initialLevels,
  currentLevelId: null,
  completedActs: [],
  modeUnlocked: {
    sandbox: false,
    challenge: false,
  },

  completeAct: (act: number) =>
    set((state: any) => {
      // Keep previous behavior: update actState and unlock levels after Act 5
      let updatedLevels = [...state.levels];
      let actState = state.actState as string;

      // Track completed acts in a typed structure
      const completedActs = new Set<number>(state.completedActs ?? []);
      completedActs.add(act);

      if (act === 1) {
        actState = "act1_complete";
      } else if (act === 2) {
        actState = "act2_complete";
      } else if (act === 3) {
        actState = "act3_complete";
      } else if (act === 4) {
        actState = "act4_complete";
      } else if (act === 5) {
        actState = "act5_complete";
        // Unlock levels 1-3 after Act 5
        updatedLevels = updatedLevels.map((level) => {
          if (level.id === 1 || level.id === 2 || level.id === 3) {
            return { ...level, unlocked: true };
          }
          return level;
        });
      }

      const completedActsArray = Array.from(completedActs.values()).sort();

      return {
        actState,
        levels: updatedLevels,
        completedActs: completedActsArray,
        modeUnlocked: evaluateUnlocks(completedActsArray),
      };
    }),

  selectLevel: (levelId: number) =>
    set(() => ({
      currentLevelId: levelId,
      // navigationSlice still exposes `screen`, so we can set it here
      screen: "puzzle",
    })),

  completeLevel: (levelId: number) =>
    set((state: any) => {
      const updatedLevels = state.levels.map((level: Level, idx: number) => {
        if (level.id === levelId && idx < state.levels.length - 1) {
          return level;
        }
        if (level.id === levelId + 1) {
          return { ...level, unlocked: true };
        }
        return level;
      });

      return {
        levels: updatedLevels,
        currentLevelId: null,
        screen: "map",
      };
    }),

  unlockLevel: (levelId: number) =>
    set((state: any) => ({
      levels: state.levels.map((level: Level) =>
        level.id === levelId ? { ...level, unlocked: true } : level
      ),
    })),
});

/**
 * Evaluate mode unlocks from completed acts
 * - sandbox: unlocked after Act 2
 * - challenge: unlocked after Acts 1–5 all complete
 */
export const evaluateUnlocks = (completedActs: number[]) => {
  const set = new Set(completedActs);
  const sandbox = set.has(2);
  const challenge = [1, 2, 3, 4, 5].every((act) => set.has(act));
  return { sandbox, challenge };
};



