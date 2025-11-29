import { useState } from "react";
import { StoryScene } from "@/components/common/StoryScene";
import { BranchingLesson } from "./BranchingLesson";

interface Act2BranchingProps {
  onComplete: () => void;
}

type Phase = "story" | "lesson";

export const Act2Branching = ({ onComplete }: Act2BranchingProps) => {
  const [phase, setPhase] = useState<Phase>("story");

  const storyScenes = [
    {
      speaker: "Keif-X",
      text: "Great work creating your first commit. Now your project has a history.",
      type: "character" as const,
    },
    {
      speaker: "Keif-X",
      text: "But what happens when developers need to work on different things at the same time?",
      type: "character" as const,
    },
    {
      speaker: "Keif-X",
      text: "That's where branches come in. A branch is a parallel line of development.",
      type: "character" as const,
    },
    {
      speaker: "Keif-X",
      text: "Let me show you. We'll create a new branch called 'feature-login'.",
      type: "character" as const,
    },
  ];

  const handleStoryComplete = () => {
    setPhase("lesson");
  };

  if (phase === "story") {
    return <StoryScene scenes={storyScenes} onComplete={handleStoryComplete} />;
  }

  return <BranchingLesson onComplete={onComplete} />;
};
