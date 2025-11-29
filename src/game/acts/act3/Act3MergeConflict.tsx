import { useState } from "react";
import { StoryScene } from "@/components/common/StoryScene";
import { ConflictVisualization } from "./ConflictVisualization";
import { ConflictResolutionLesson } from "./ConflictResolutionLesson";

interface Act3MergeConflictProps {
  onComplete: () => void;
}

type Phase = "story" | "visualization" | "resolution";

const storyScenes = [
  {
    speaker: "SYSTEM",
    text: "WARNING: Repository corruption detected.",
    type: "system" as const,
  },
  {
    speaker: "BugLord",
    text: "Hello little engineer... I see you're trying to fix MY timeline.",
    type: "character" as const,
  },
  {
    speaker: "BugLord",
    text: "Let's see you handle *real* development chaos.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "Stay calm. Conflicts happen when two branches change the same lines differently.",
    type: "character" as const,
  },
  {
    speaker: "Keif-X",
    text: "Let's walk through resolving your first merge conflict together.",
    type: "character" as const,
  },
];

export const Act3MergeConflict = ({ onComplete }: Act3MergeConflictProps) => {
  const [phase, setPhase] = useState<Phase>("story");

  const handleStoryComplete = () => {
    setPhase("visualization");
  };

  const handleVisualizationComplete = () => {
    setPhase("resolution");
  };

  if (phase === "story") {
    return <StoryScene scenes={storyScenes} onComplete={handleStoryComplete} />;
  }

  if (phase === "visualization") {
    return <ConflictVisualization onComplete={handleVisualizationComplete} />;
  }

  if (phase === "resolution") {
    return <ConflictResolutionLesson onComplete={onComplete} />;
  }

  return null;
};
