import { useGameStore as useStore } from "./gameStore";
import { Level, MergeLevel, RebaseLevel, CherryPickLevel } from "@/types/game";

// Re-export store for convenience
export { useGameStore } from "./gameStore";

// Screen selectors
export const useScreen = () => useStore((state) => state.screen);
export const useActState = () => useStore((state) => state.actState);

// Level selectors
export const useLevels = () => useStore((state) => state.levels);
export const useCurrentLevel = (): Level | undefined => {
  const currentLevelId = useStore((state) => state.currentLevelId);
  const levels = useStore((state) => state.levels);
  return levels.find((l) => l.id === currentLevelId);
};

export const useCurrentLevelTyped = () => {
  const level = useCurrentLevel();
  if (!level) return null;
  
  if (level.type === "merge") return level as MergeLevel;
  if (level.type === "rebase") return level as RebaseLevel;
  if (level.type === "cherry-pick") return level as CherryPickLevel;
  return null;
};

// Terminal selectors
export const useTerminalLines = () => useStore((state) => state.terminalLines);

// Lesson selectors
export const useLessonStep = () => useStore((state) => state.currentLessonStep);
export const useConceptPanelVisible = () => useStore((state) => state.showConceptPanel);

// Editor selectors
export const useEditorContent = () => useStore((state) => state.editorContent);

// Re-export game actions
export { startGame, completeAct, navigateToScreen, nextStep, resetGame } from "./gameActions";

// Progression selectors
export const useCompletedActs = () =>
  useStore((state) => state.completedActs ?? []);

export const useIsActComplete = (act: number) =>
  useStore((state) => (state.completedActs ?? []).includes(act));

export const useModeUnlocks = () =>
  useStore(
    (state) => state.modeUnlocked ?? { sandbox: false, challenge: false }
  );

export const useIsSandboxUnlocked = () =>
  useStore((state) => state.modeUnlocked?.sandbox ?? false);

export const useIsChallengeUnlocked = () =>
  useStore((state) => state.modeUnlocked?.challenge ?? false);


