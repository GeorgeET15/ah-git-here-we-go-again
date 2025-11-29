import type { StateCreator } from "zustand";
import type { GameScreen, ActState } from "../types";

/**
 * NavigationSlice
 * - Responsible for high-level navigation & act state (FSM node)
 * - Kept flat in the root store for backward compatibility
 */

export interface NavigationSliceState {
  screen: GameScreen;
  actState: ActState;
}

export interface NavigationSliceActions {
  setScreen: (screen: GameScreen) => void;
  setActState: (act: ActState) => void;
}

export type NavigationSlice = NavigationSliceState & NavigationSliceActions;

// We use `any` for the root state here to avoid circular type dependencies.
export const createNavigationSlice: StateCreator<
  any,
  [],
  [],
  NavigationSlice
> = (set) => ({
  screen: "home",
  actState: "idle",

  setScreen: (screen) => set({ screen }),
  setActState: (act) => set({ actState: act }),
});


