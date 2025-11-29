import type { StateCreator } from "zustand";

/**
 * ChallengeSlice
 * - State for Simulation Arena / challenge runs
 * - Currently minimal and not yet wired to UI; safe for future expansion
 */

export interface ChallengeRunResult {
  scenarioId: string;
  score: number;
  completedAt: number;
}

export interface ChallengeSliceState {
  currentScenarioId: string | null;
  currentScore: number;
  results: ChallengeRunResult[];
}

export interface ChallengeSliceActions {
  startChallenge: (scenarioId: string) => void;
  completeChallenge: (score: number) => void;
  resetChallenge: () => void;
}

export type ChallengeSlice = ChallengeSliceState & ChallengeSliceActions;

export const createChallengeSlice: StateCreator<
  any,
  [],
  [],
  ChallengeSlice
> = (set, get) => ({
  currentScenarioId: null,
  currentScore: 0,
  results: [],

  startChallenge: (scenarioId: string) =>
    set(() => ({
      currentScenarioId: scenarioId,
      currentScore: 0,
    })),

  completeChallenge: (score: number) =>
    set((state: any) => {
      if (!state.currentScenarioId) {
        return state;
      }
      const result: ChallengeRunResult = {
        scenarioId: state.currentScenarioId,
        score,
        completedAt: Date.now(),
      };
      return {
        currentScenarioId: null,
        currentScore: 0,
        results: [...state.results, result],
      };
    }),

  resetChallenge: () =>
    set(() => ({
      currentScenarioId: null,
      currentScore: 0,
      results: [],
    })),
});


