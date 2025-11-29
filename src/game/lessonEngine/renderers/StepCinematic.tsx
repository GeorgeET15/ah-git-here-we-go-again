/**
 * Step Cinematic Renderer
 * Renders the cinematic intro sequence
 */

import React from "react";
import { CinematicIntro } from "@/components/cinematic/CinematicIntro";
import { useLessonEngine } from "../LessonContext";
import { CinematicStep } from "../types";
import { useSettingsStore } from "@/game/state/settingsStore";

interface StepCinematicProps {
  step: CinematicStep;
}

export const StepCinematic: React.FC<StepCinematicProps> = ({ step }) => {
  const { nextStep, goToStep } = useLessonEngine();
  const { playerName } = useSettingsStore();

  const handleComplete = () => {
    // Move to next step after cinematic completes
    if (step.nextStep) {
      goToStep(step.nextStep);
    } else {
      nextStep();
    }
  };

  // CinematicIntro uses a portal to render directly to document.body
  // No wrapper needed - it handles its own positioning
  return (
    <CinematicIntro
      onComplete={handleComplete}
      playerName={playerName || "Engineer"}
    />
  );
};
