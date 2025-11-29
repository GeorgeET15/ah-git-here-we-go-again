/**
 * Step Renderer for Dialog Steps
 */

import React, { useEffect, useState } from "react";
import { useLessonEngine } from "../LessonContext";
import { DialogStep } from "../types";
import { StoryScene } from "@/components/common/StoryScene";

interface StepDialogProps {
  step: DialogStep;
}

export const StepDialog: React.FC<StepDialogProps> = ({ step }) => {
  const { nextStep, state } = useLessonEngine();
  const [dialogSteps, setDialogSteps] = useState<DialogStep[]>([step]);

  useEffect(() => {
    // Collect all consecutive dialog steps starting from current
    const steps: DialogStep[] = [];
    let currentIndex = state.currentStepIndex;
    
    while (
      currentIndex < (state.lesson?.steps.length || 0) &&
      state.lesson?.steps[currentIndex]?.type === "dialog"
    ) {
      steps.push(state.lesson.steps[currentIndex] as DialogStep);
      currentIndex++;
    }

    setDialogSteps(steps);
  }, [state.currentStepIndex, state.lesson]);

  const scenes = dialogSteps.map((s) => ({
    speaker: s.speaker,
    text: s.text,
    type: (s.speakerType || "character") as "system" | "character",
  }));

  const handleComplete = () => {
    // Advance past all dialog steps
    // We need to advance dialogSteps.length times to get past all dialogs
    for (let i = 0; i < dialogSteps.length; i++) {
      nextStep();
    }
  };

  return <StoryScene scenes={scenes} onComplete={handleComplete} />;
};

