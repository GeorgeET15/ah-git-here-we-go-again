import { ActState, GameScreen } from "./types";

/**
 * Game State Machine
 * Defines valid transitions between game states
 */
export type GameStateTransition = {
  from: ActState;
  to: ActState;
  screen?: GameScreen;
  condition?: () => boolean;
  onTransition?: () => void;
};

/**
 * State machine configuration
 */
export const gameStateMachine: Record<ActState, {
  allowedTransitions: ActState[];
  defaultScreen?: GameScreen;
  description: string;
}> = {
  idle: {
    allowedTransitions: ["act1"],
    defaultScreen: "intro",
    description: "Initial state, game not started",
  },
  act1: {
    allowedTransitions: ["act1_complete"],
    defaultScreen: "story",
    description: "Act 1: Introduction and first commit",
  },
  act1_complete: {
    allowedTransitions: ["act2"],
    defaultScreen: "act2",
    description: "Act 1 completed, ready for Act 2",
  },
  act2: {
    allowedTransitions: ["act2_complete"],
    defaultScreen: "act2",
    description: "Act 2: Branching and merging",
  },
  act2_complete: {
    allowedTransitions: ["act3"],
    defaultScreen: "act3",
    description: "Act 2 completed, ready for Act 3",
  },
  act3: {
    allowedTransitions: ["act3_complete"],
    defaultScreen: "act3",
    description: "Act 3: Merge conflicts",
  },
  act3_complete: {
    allowedTransitions: ["act4"],
    defaultScreen: "act4",
    description: "Act 3 completed, ready for Act 4",
  },
  act4: {
    allowedTransitions: ["act4_complete"],
    defaultScreen: "act4",
    description: "Act 4: Rebase",
  },
  act4_complete: {
    allowedTransitions: ["act5"],
    defaultScreen: "act5",
    description: "Act 4 completed, ready for Act 5",
  },
  act5: {
    allowedTransitions: ["act5_complete"],
    defaultScreen: "act5",
    description: "Act 5: Cherry-pick",
  },
  act5_complete: {
    allowedTransitions: ["map"],
    defaultScreen: "map",
    description: "Act 5 completed, unlocked puzzle levels",
  },
  map: {
    allowedTransitions: ["puzzle"],
    defaultScreen: "map",
    description: "Level map view",
  },
  puzzle: {
    allowedTransitions: ["map"],
    defaultScreen: "puzzle",
    description: "Puzzle room",
  },
};

/**
 * Check if a state transition is valid
 */
export const canTransition = (
  from: ActState,
  to: ActState
): boolean => {
  const stateConfig = gameStateMachine[from];
  if (!stateConfig) return false;
  
  return stateConfig.allowedTransitions.includes(to);
};

/**
 * Get the default screen for a state
 */
export const getDefaultScreen = (state: ActState): GameScreen | undefined => {
  return gameStateMachine[state]?.defaultScreen;
};

/**
 * Get next valid states from current state
 */
export const getNextStates = (currentState: ActState): ActState[] => {
  return gameStateMachine[currentState]?.allowedTransitions || [];
};

/**
 * State transition helper
 */
export const transitionTo = (
  currentState: ActState,
  targetState: ActState
): { valid: boolean; screen?: GameScreen; error?: string } => {
  if (!canTransition(currentState, targetState)) {
    return {
      valid: false,
      error: `Invalid transition from ${currentState} to ${targetState}`,
    };
  }

  const screen = getDefaultScreen(targetState);
  return {
    valid: true,
    screen,
  };
};

/**
 * Get act number from state
 */
export const getActFromState = (state: ActState): number | null => {
  if (state.startsWith("act")) {
    const match = state.match(/act(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  return null;
};

/**
 * Check if state represents a completed act
 */
export const isActComplete = (state: ActState): boolean => {
  return state.endsWith("_complete");
};

/**
 * Get current act number (or null if not in an act)
 */
export const getCurrentAct = (state: ActState): number | null => {
  if (isActComplete(state)) {
    // Extract act number from "actN_complete"
    const match = state.match(/act(\d+)_complete/);
    return match ? parseInt(match[1], 10) : null;
  }
  return getActFromState(state);
};


