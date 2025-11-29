export type LevelType = "merge" | "rebase" | "cherry-pick";

export interface CommitNode {
  id: string;
  sha: string;
  message: string;
  branch: "main" | "feature";
}

export interface MergeLevel {
  id: number;
  name: string;
  type: "merge";
  blocks: string[];
  solution: string[];
  hint: string;
  unlocked: boolean;
}

export interface RebaseLevel {
  id: number;
  name: string;
  type: "rebase";
  description: string;
  commits: CommitNode[];
  mainTimeline: string[];
  featureTimeline: string[];
  correctTimeline: string[];
  hint: string;
  unlocked: boolean;
}

export interface CherryPickCommit {
  id: string;
  sha: string;
  message: string;
  key: boolean;
}

export interface CherryPickLevel {
  id: number;
  name: string;
  type: "cherry-pick";
  description: string;
  mainTimeline: string[];
  featureTimeline: CherryPickCommit[];
  expectedFinal: string[];
  hint: string;
  unlocked: boolean;
}

export type Level = MergeLevel | RebaseLevel | CherryPickLevel;

export interface GameState {
  currentLevel: number;
  levels: Level[];
  completedLevels: number[];
}
