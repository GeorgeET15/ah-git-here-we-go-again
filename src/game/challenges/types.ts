/**
 * Challenge System Types
 * Defines the structure for Git challenges in Game Round mode
 */

export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeCategory = 
  | "init" 
  | "commit" 
  | "branch" 
  | "merge" 
  | "rebase" 
  | "cherry-pick" 
  | "conflict"
  | "log"
  | "status";

export interface ChallengeHint {
  level: 1 | 2 | 3; // 1 = subtle, 2 = helpful, 3 = obvious
  text: string;
  cost: number; // Points deducted
}

export interface VisualContext {
  terminalOutput?: string[];
  fileTree?: string[];
  commitGraph?: {
    branches: Array<{
      name: string;
      commits: Array<{ sha: string; message: string }>;
    }>;
  };
  errorMessage?: string;
}

export interface GitChallenge {
  id: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  
  // Problem description
  scenario: string;
  bugDescription: string;
  visualContext?: VisualContext;
  
  // Solution
  correctCommand: string;
  commandPattern: RegExp | string; // Can be regex string or pattern
  alternativeCommands?: string[];
  
  // Scoring
  basePoints: number;
  timeBonus: number; // Points per second remaining
  maxTime: number; // Seconds
  
  // Hints (cost points)
  hints: ChallengeHint[];
  
  // Feedback
  successMessage: string;
  explanation: string;
  
  // Optional metadata
  actNumber?: number; // Which act this relates to
  tags?: string[];
}

export interface ChallengeResult {
  challengeId: string;
  completed: boolean;
  score: number;
  timeTaken: number;
  hintsUsed: number[];
  attempts: number;
  completedAt: number;
}

export interface GameRoundState {
  currentChallengeIndex: number;
  totalChallenges: number;
  score: number;
  challengesCompleted: number;
  results: ChallengeResult[];
  startTime: number;
}

