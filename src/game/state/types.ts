import { Level } from "@/types/game";

// Typed enums for screens and acts (for future refactor)
// NOTE: Existing string union types are kept for backward compatibility.

export enum ScreenId {
  HOME = "home",
  INTRO = "intro",
  STORY = "story",
  LESSON = "lesson",
  ACT2 = "act2",
  ACT3 = "act3",
  ACT4 = "act4",
  ACT5 = "act5",
  ACT6 = "act6",
  BOSS = "boss",
  MAP = "map",
  PUZZLE = "puzzle",
  GAME_ROUND = "gameRound",
  GAME_RESULTS = "gameResults",
  SANDBOX = "sandbox",
}

// Game Screen States (legacy type, still used throughout the app)
export type GameScreen = `${ScreenId}`;

export enum ActId {
  IDLE = "idle",
  ACT1 = "act1",
  ACT1_COMPLETE = "act1_complete",
  ACT2 = "act2",
  ACT2_COMPLETE = "act2_complete",
  ACT3 = "act3",
  ACT3_COMPLETE = "act3_complete",
  ACT4 = "act4",
  ACT4_COMPLETE = "act4_complete",
  ACT5 = "act5",
  ACT5_COMPLETE = "act5_complete",
  MAP = "map",
  PUZZLE = "puzzle",
}

// Act States (legacy type, still used throughout the app)
export type ActState = `${ActId}`;

// Terminal Line Types
export type TerminalLineType = "command" | "output" | "error" | "success" | "info";

export interface TerminalLine {
  type: TerminalLineType;
  text: string;
}

// Game State Interface
export interface GameState {
  // Navigation
  screen: GameScreen;
  actState: ActState;
  
  // Progress
  levels: Level[];
  currentLevelId: number | null;

  /**
   * Acts that have been completed (1..5)
   * - New typed structure to replace string-based actX_complete checks over time
   */
  completedActs?: number[];

  /**
   * Mode unlocks derived from completedActs
   * - sandbox: Research Lab
   * - challenge: Simulation Arena
   */
  modeUnlocked?: {
    sandbox: boolean;
    challenge: boolean;
  };
  
  // Terminal
  terminalLines: TerminalLine[];
  
  // Lesson State
  currentLessonStep: string | null;
  showConceptPanel: boolean;
  
  // Editor State
  editorContent: string;
  
  // Timeline State
  timelineState: Record<string, unknown>;
}

// Game Actions
export type GameAction =
  | { type: "GAME/START" }
  | { type: "GAME/NEXT_STEP" }
  | { type: "GAME/SET_SCREEN"; screen: GameScreen }
  | { type: "GAME/SET_ACT"; act: ActState }
  | { type: "GAME/COMPLETE_ACT"; act: number }
  | { type: "TERMINAL/ADD_LINE"; line: TerminalLine }
  | { type: "TERMINAL/CLEAR" }
  | { type: "MAP/SELECT_LEVEL"; levelId: number }
  | { type: "MAP/COMPLETE_LEVEL"; levelId: number }
  | { type: "MAP/UNLOCK_LEVEL"; levelId: number }
  | { type: "LESSON/SET_STEP"; step: string }
  | { type: "CONCEPT/SHOW"; show: boolean }
  | { type: "EDITOR/UPDATE"; content: string };


