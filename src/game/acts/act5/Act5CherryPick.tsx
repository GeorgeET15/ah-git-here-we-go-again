import { useState } from "react";
import { StoryScene } from "@/components/common/StoryScene";
import { CherryPickLesson } from "./CherryPickLesson";

interface Act5CherryPickProps {
  onComplete: () => void;
}

type Phase = "story" | "lesson";

const storyScenes = [
  {
    speaker: "System",
    text: "**ALERT: Production failure detected. Crash reports rising.**",
    type: "system" as const,
  },
  {
    speaker: "BugLord",
    text: "Oops. Looks like somebody deleted a *very* important commit.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "This commit fixed a critical crash. Without it, the project is broken.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "But there's hope — Git never forgets. Even deleted commits still exist in history.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "We can rescue it using `git cherry-pick` — the power to extract single commits.",
    type: "character" as const,
  },
];

export const Act5CherryPick = ({ onComplete }: Act5CherryPickProps) => {
  const [phase, setPhase] = useState<Phase>("story");

  const handleStoryComplete = () => {
    setPhase("lesson");
  };

  if (phase === "story") {
    return <StoryScene scenes={storyScenes} onComplete={handleStoryComplete} />;
  }

  return <CherryPickLesson onComplete={onComplete} />;
};

