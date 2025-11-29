import type { StateCreator } from "zustand";

/**
 * LessonSlice
 * - Tracks high-level lesson-related flags in global state
 * - Note: Detailed step state lives inside LessonEngine, not here
 */

export interface LessonSliceState {
  currentLessonStep: string | null;
}

export interface LessonSliceActions {
  setLessonStep: (step: string | null) => void;
}

export type LessonSlice = LessonSliceState & LessonSliceActions;

export const createLessonSlice: StateCreator<any, [], [], LessonSlice> = (
  set
) => ({
  currentLessonStep: null,

  setLessonStep: (step: string | null) => set({ currentLessonStep: step }),
});


