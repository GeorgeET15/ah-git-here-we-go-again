/**
 * Lesson Engine Type Definitions
 */

export type StepType = "dialog" | "concept" | "terminal" | "editor" | "timeline" | "cinematic" | "complete";

export type TerminalLineType = "command" | "output" | "error" | "success";

export interface TerminalLine {
  type: TerminalLineType;
  text: string;
}

export interface CommandSuggestion {
  command: string;
  hint: string;
}

export interface DialogStep {
  id: string;
  type: "dialog";
  speaker: string;
  text: string;
  speakerType?: "system" | "character";
  nextStep?: string;
}

export interface ConceptStep {
  id: string;
  type: "concept";
  conceptId: string;
  autoShow?: boolean;
  nextStep?: string;
}

export interface TerminalStep {
  id: string;
  type: "terminal";
  title?: string;
  initialOutput?: TerminalLine[];
  expectedCommand: string;
  commandPattern: string;
  suggestions: CommandSuggestion[];
  successOutput: TerminalLine[];
  errorOutput: TerminalLine[];
  visualEvent?: string;
  visualData?: Record<string, any>;
  soundEvent?: string;
  conceptId?: string;
  nextStep?: string;
}

export interface EditorStep {
  id: string;
  type: "editor";
  file: string;
  initialContent?: string;
  expectedContent?: string;
  expectedFix?: string;
  hint?: string;
  readonly?: boolean;
  nextStep?: string;
}

export interface TimelineStep {
  id: string;
  type: "timeline";
  event: string;
  data?: Record<string, any>;
  nextStep?: string;
}

export interface CinematicStep {
  id: string;
  type: "cinematic";
  duration?: number; // milliseconds
  nextStep?: string;
}

export interface CompleteStep {
  id: string;
  type: "complete";
  message: string;
  nextAct?: number;
}

export type LessonStep = 
  | DialogStep 
  | ConceptStep 
  | TerminalStep 
  | EditorStep 
  | TimelineStep 
  | CinematicStep
  | CompleteStep;

export interface LessonDefinition {
  actId: number;
  title: string;
  description?: string;
  steps: LessonStep[];
  visualizations?: {
    timeline?: {
      initialState: string;
      states: Record<string, any>;
    };
    editor?: {
      file: string;
      brokenContent?: string;
      fixedContent?: string;
      initialContent?: string;
      readonly?: boolean;
    };
    commits?: Array<{
      sha: string;
      message: string;
      isMissing?: boolean;
    }>;
  };
}

export interface LessonEngineState {
  currentAct: number;
  currentStepIndex: number;
  currentStep: LessonStep | null;
  lesson: LessonDefinition | null;
  isComplete: boolean;
}

export type LessonEventType =
  | "lesson.started"
  | "lesson.completed"
  | "step.started"
  | "step.completed"
  | "command.success"
  | "command.failed"
  | "concept.shown"
  | "timeline.initialize"
  | "timeline.addCommit"
  | "timeline.stage"
  | "editor.openConflict"
  | "editor.resolveConflict";

export interface LessonEvent {
  type: LessonEventType;
  payload?: any;
  timestamp: number;
}

