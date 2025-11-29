import { useState } from "react";
import { StoryScene } from "@/components/common/StoryScene";
import { RebaseVisualization } from "./RebaseVisualization";
import { RebaseLesson } from "./RebaseLesson";

interface Act4RebaseProps {
  onComplete: () => void;
}

type Phase = "story" | "visualization" | "lesson";

const storyScenes = [
  {
    speaker: "Keif-X",
    text: "The repo is stabilizing, but timelines are still fractured.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "Look — the feature branch has commits that should be part of main, but history is messy.",
    type: "character" as const,
  },
  {
    speaker: "BugLord",
    text: "Hah! Enjoy your spaghetti graph. Impossible to read. Impossible to share.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "We can fix this. We'll rewrite the timeline using rebase.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "Rebase takes commits from one branch and replays them on top of another. Clean. Linear. Elegant.",
    type: "character" as const,
  },
];

export const Act4Rebase = ({ onComplete }: Act4RebaseProps) => {
  const [phase, setPhase] = useState<Phase>("story");

  const handleStoryComplete = () => {
    setPhase("visualization");
  };

  const handleVisualizationComplete = () => {
    setPhase("lesson");
  };

  if (phase === "story") {
    return <StoryScene scenes={storyScenes} onComplete={handleStoryComplete} />;
  }

  if (phase === "visualization") {
    return <RebaseVisualization onComplete={handleVisualizationComplete} />;
  }

  if (phase === "lesson") {
    return <RebaseLesson onComplete={onComplete} />;
  }

  return null;
};
