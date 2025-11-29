/**
 * Lesson Engine - Core logic for managing lesson progression
 */

import { LessonDefinition, LessonStep, LessonEngineState, TerminalStep } from "./types";
import { lessonEventBus } from "./events";

export class LessonEngine {
  private state: LessonEngineState = {
    currentAct: 0,
    currentStepIndex: 0,
    currentStep: null,
    lesson: null,
    isComplete: false,
  };

  /**
   * Load a lesson definition
   */
  async loadLesson(actId: number): Promise<void> {
    try {
      // Import lesson JSON dynamically
      let lesson: LessonDefinition;
      
      switch (actId) {
        case 1:
          lesson = (await import("../lessons/act1.json")).default;
          break;
        case 2:
          lesson = (await import("../lessons/act2.json")).default;
          break;
        case 3:
          lesson = (await import("../lessons/act3.json")).default;
          break;
        case 4:
          lesson = (await import("../lessons/act4.json")).default;
          break;
        case 5:
          lesson = (await import("../lessons/act5.json")).default;
          break;
        default:
          throw new Error(`No lesson definition found for act ${actId}`);
      }

      this.state.lesson = lesson;
      this.state.currentAct = actId;
      this.state.currentStepIndex = 0;
      this.state.isComplete = false;

      if (lesson.steps.length > 0) {
        this.state.currentStep = lesson.steps[0];
      }

      lessonEventBus.emit("lesson.started", { actId, lesson });
    } catch (error) {
      console.error(`Failed to load lesson for act ${actId}:`, error);
      throw error;
    }
  }

  /**
   * Get current state
   */
  getState(): LessonEngineState {
    return { ...this.state };
  }

  /**
   * Get current step
   */
  getCurrentStep(): LessonStep | null {
    return this.state.currentStep;
  }

  /**
   * Move to next step
   */
  nextStep(): boolean {
    if (!this.state.lesson || this.state.isComplete) {
      return false;
    }

    const nextIndex = this.state.currentStepIndex + 1;

    if (nextIndex >= this.state.lesson.steps.length) {
      this.completeLesson();
      return false;
    }

    this.state.currentStepIndex = nextIndex;
    this.state.currentStep = this.state.lesson.steps[nextIndex];

    lessonEventBus.emit("step.started", {
      step: this.state.currentStep,
      index: nextIndex,
    });

    return true;
  }

  /**
   * Move to a specific step by ID
   */
  goToStep(stepId: string): boolean {
    if (!this.state.lesson) {
      return false;
    }

    const stepIndex = this.state.lesson.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) {
      return false;
    }

    this.state.currentStepIndex = stepIndex;
    this.state.currentStep = this.state.lesson.steps[stepIndex];

    lessonEventBus.emit("step.started", {
      step: this.state.currentStep,
      index: stepIndex,
    });

    return true;
  }

  /**
   * Handle terminal command
   */
  handleCommand(command: string): { success: boolean; output?: any[] } {
    const step = this.state.currentStep;
    if (!step || step.type !== "terminal") {
      return { success: false };
    }

    const terminalStep = step as TerminalStep;
    const trimmedCommand = command.trim();

    // Check if command matches expected pattern
    const pattern = new RegExp(terminalStep.commandPattern);
    const matches = pattern.test(trimmedCommand);

    if (matches) {
      // Command success
      lessonEventBus.emit("command.success", {
        command: trimmedCommand,
        step: terminalStep.id,
      });

      // Emit visual event if specified
      if (terminalStep.visualEvent) {
        lessonEventBus.emit(terminalStep.visualEvent, terminalStep.visualData || {});
      }

      // Emit sound event if specified
      if (terminalStep.soundEvent) {
        lessonEventBus.emit("sound.play", { event: terminalStep.soundEvent });
      }

      // Move to next step if specified
      // If nextStep is specified, go to it (usually the concept step)
      // Otherwise auto-advance to next step in sequence
      if (terminalStep.nextStep) {
        this.goToStep(terminalStep.nextStep);
      } else {
        this.nextStep();
      }

      return {
        success: true,
        output: terminalStep.successOutput,
      };
    } else {
      // Command failed
      lessonEventBus.emit("command.failed", {
        command: trimmedCommand,
        step: terminalStep.id,
      });

      return {
        success: false,
        output: terminalStep.errorOutput,
      };
    }
  }

  /**
   * Complete the lesson
   */
  private completeLesson(): void {
    this.state.isComplete = true;
    lessonEventBus.emit("lesson.completed", {
      actId: this.state.currentAct,
    });
  }

  /**
   * Get suggestions for current step
   */
  getSuggestions(): Array<{ command: string; hint: string }> {
    const step = this.state.currentStep;
    if (step && step.type === "terminal") {
      return (step as TerminalStep).suggestions;
    }
    return [];
  }

  /**
   * Get initial output for current step
   */
  getInitialOutput(): any[] {
    const step = this.state.currentStep;
    if (step && step.type === "terminal") {
      return (step as TerminalStep).initialOutput || [];
    }
    return [];
  }
}

// Singleton instance
export const lessonEngine = new LessonEngine();

