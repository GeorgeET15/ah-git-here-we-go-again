/**
 * Lesson Step Renderer - Renders the appropriate component based on step type
 */

import React from "react";
import { useLessonEngine } from "./LessonContext";
import { LessonStep, CompleteStep } from "./types";
import { StepDialog } from "./renderers/StepDialog";
import { StepConceptPanel } from "./renderers/StepConceptPanel";
import { StepTerminalCommand } from "./renderers/StepTerminalCommand";
import { StepEditorTask } from "./renderers/StepEditorTask";
import { StepTimelineEvent } from "./renderers/StepTimelineEvent";
import { StepCinematic } from "./renderers/StepCinematic";
import { StepComplete } from "./renderers/StepComplete";

interface LessonStepRendererProps {
  onComplete?: () => void;
}

export const LessonStepRenderer: React.FC<LessonStepRendererProps> = ({ onComplete }) => {
  const { currentStep } = useLessonEngine();

  if (!currentStep) {
    return <div>Loading lesson...</div>;
  }

  switch (currentStep.type) {
    case "cinematic":
      return <StepCinematic step={currentStep} />;
    case "dialog":
      return <StepDialog step={currentStep} />;
    case "concept":
      return <StepConceptPanel step={currentStep} />;
    case "terminal":
      return <StepTerminalCommand step={currentStep} />;
    case "editor":
      return <StepEditorTask step={currentStep} />;
    case "timeline":
      return <StepTimelineEvent step={currentStep} />;
    case "complete":
      return <StepComplete step={currentStep as CompleteStep} onComplete={onComplete} />;
    default:
      return <div>Unknown step type: {(currentStep as any).type}</div>;
  }
};

