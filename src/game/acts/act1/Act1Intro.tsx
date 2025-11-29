import { StoryScene } from "@/components/common/StoryScene";

interface Act1IntroProps {
  onComplete: () => void;
}

export const Act1Intro = ({ onComplete }: Act1IntroProps) => {
  const scenes = [
    {
      speaker: "System",
      text: "Loading repository simulation… initializing history engine.",
      type: "system" as const,
    },
    {
      speaker: "Keif-X",
      text: "Welcome engineer. Something has corrupted the source code timeline.",
      type: "character" as const,
    },
    {
      speaker: "Keif-X",
      text: "To repair it, you'll need to master Git — the time machine for software history.",
      type: "character" as const,
    },
    {
      speaker: "Keif-X",
      text: "Let's start with the most important concept: a commit.",
      type: "character" as const,
    },
    {
      speaker: "Keif-X",
      text: "A commit is a snapshot of your project at a moment in time. Every time you commit, a new node is added to the timeline.",
      type: "character" as const,
    },
  ];

  return <StoryScene scenes={scenes} onComplete={onComplete} />;
};
