/**
 * Event System Types
 */

export type EventType = 
  | "GAME/NEXT_STEP"
  | "GAME/SET_ACT"
  | "TERMINAL/RUN_COMMAND"
  | "TIMELINE/APPLY_COMMIT"
  | "EDITOR/UPDATE_CONTENT"
  | "MERGE/RESOLVE_CONFLICT"
  | "REBASE/APPLY_COMMIT"
  | "CHERRYPICK/APPLY"
  | "MAP/UNLOCK_LEVEL"
  | "CONCEPT/SHOW"
  | "CONCEPT/HIDE";

export interface BaseEvent {
  type: EventType;
  timestamp: number;
  payload?: Record<string, unknown>;
}

export interface GameEvent extends BaseEvent {
  type: "GAME/NEXT_STEP" | "GAME/SET_ACT";
  payload?: {
    act?: number;
    step?: string;
  };
}

export interface TerminalEvent extends BaseEvent {
  type: "TERMINAL/RUN_COMMAND";
  payload: {
    command: string;
    result?: "success" | "error";
  };
}

export interface TimelineEvent extends BaseEvent {
  type: "TIMELINE/APPLY_COMMIT";
  payload: {
    commitId: string;
    branch: string;
  };
}

export interface EditorEvent extends BaseEvent {
  type: "EDITOR/UPDATE_CONTENT";
  payload: {
    content: string;
  };
}

export interface MergeEvent extends BaseEvent {
  type: "MERGE/RESOLVE_CONFLICT";
  payload: {
    conflictId: string;
    resolution: "head" | "incoming" | "both";
  };
}

export interface RebaseEvent extends BaseEvent {
  type: "REBASE/APPLY_COMMIT";
  payload: {
    commitId: string;
    position: number;
  };
}

export interface CherryPickEvent extends BaseEvent {
  type: "CHERRYPICK/APPLY";
  payload: {
    commitSha: string;
    targetBranch: string;
  };
}

export interface MapEvent extends BaseEvent {
  type: "MAP/UNLOCK_LEVEL";
  payload: {
    levelId: number;
  };
}

export interface ConceptEvent extends BaseEvent {
  type: "CONCEPT/SHOW" | "CONCEPT/HIDE";
  payload?: {
    conceptKey?: string;
  };
}

export type GameEventUnion = 
  | GameEvent
  | TerminalEvent
  | TimelineEvent
  | EditorEvent
  | MergeEvent
  | RebaseEvent
  | CherryPickEvent
  | MapEvent
  | ConceptEvent;

export type EventHandler = (event: GameEventUnion) => void | Promise<void>;


