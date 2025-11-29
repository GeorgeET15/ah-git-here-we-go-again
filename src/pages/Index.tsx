import React, { useState, useEffect } from "react";
import { GraphMap } from "@/components/common/GraphMap";
import { PuzzleRoom } from "@/game/puzzles/PuzzleRoom";
import { RebasePuzzleRoom } from "@/game/puzzles/RebasePuzzleRoom";
import { CherryPickPuzzleRoom } from "@/game/puzzles/CherryPickPuzzleRoom";
import { Act1LessonEngine } from "@/game/acts/act1/Act1LessonEngine";
import { Act2LessonEngine } from "@/game/acts/act2/Act2LessonEngine";
import { Act3LessonEngine } from "@/game/acts/act3/Act3LessonEngine";
import { Act4LessonEngine } from "@/game/acts/act4/Act4LessonEngine";
import { Act5LessonEngine } from "@/game/acts/act5/Act5LessonEngine";
import { ChaosMergeBattle } from "@/game/acts/act6";
import { MergeLevel, RebaseLevel, CherryPickLevel } from "@/types/game";
import { GitMerge } from "lucide-react";
import { 
  useScreen, 
  useLevels, 
  useCurrentLevelTyped,
  useGameStore,
  startGame,
  completeAct,
  navigateToScreen
} from "@/game/state/selectors";
import { AppShell } from "@/ui/layout";
import { HomeScreen } from "./HomeScreen";
import { GameRound } from "@/game/challenges/GameRound";
import { GameResults } from "@/game/challenges/GameResults";
import { ChallengeResult } from "@/game/challenges/types";
import { SandboxMode } from "@/game/sandbox";

const Index = () => {
  const screen = useScreen();
  const levels = useLevels();
  const currentLevel = useCurrentLevelTyped();
  const { 
    setScreen, 
    completeAct, 
    selectLevel, 
    completeLevel 
  } = useGameStore();

  // Ensure we always start at home screen on mount
  useEffect(() => {
    const currentScreen = useGameStore.getState().screen;
    if (currentScreen !== "home" && currentScreen !== "intro") {
      setScreen("home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const [gameRoundScore, setGameRoundScore] = useState(0);
  const [gameRoundResults, setGameRoundResults] = useState<ChallengeResult[]>([]);

  const handleStartGame = () => {
    startGame();
  };

  const handleStartTutorial = () => {
    startGame();
  };

  const handleStartGameRound = () => {
    setScreen("gameRound");
  };

  const handleGameRoundComplete = (finalScore: number, results: ChallengeResult[]) => {
    setGameRoundScore(finalScore);
    setGameRoundResults(results);
    setScreen("gameResults");
  };

  const handleGameResultsReplay = () => {
    setScreen("gameRound");
  };

  const handleGameResultsHome = () => {
    setScreen("home");
  };

  const handleSandboxExit = () => {
    setScreen("home");
  };

  const handleStoryComplete = () => {
    navigateToScreen("lesson");
  };

  const handleLessonComplete = () => {
    // Complete Act 1 and then go to Act 2
    completeAct(1);
    navigateToScreen("act2");
  };

  const handleAct2Complete = () => {
    completeAct(2);
  };

  const handleAct3Complete = () => {
    completeAct(3);
  };

  const handleAct4Complete = () => {
    completeAct(4);
  };

  const handleAct5Complete = () => {
    completeAct(5);
  };

  const handleAct6Complete = () => {
    completeAct(6);
    // After boss battle, return to map
    setScreen("map");
  };

  const handleSelectLevel = (levelId: number) => {
    selectLevel(levelId);
  };

  const handleCompleteLevel = () => {
    if (currentLevel) {
      completeLevel(currentLevel.id);
    }
  };

  const handleBackToMap = () => {
    setScreen("map");
  };

  if (screen === "home" || screen === "intro") {
    return (
      <HomeScreen
        onStartTutorial={handleStartTutorial}
        onStartGame={handleStartGameRound}
        onStartSandbox={() => setScreen("sandbox")}
      />
    );
  }

  if (screen === "gameRound") {
    return (
      <GameRound
        onComplete={handleGameRoundComplete}
        onExit={() => setScreen("home")}
      />
    );
  }

  if (screen === "gameResults") {
    return (
      <GameResults
        finalScore={gameRoundScore}
        results={gameRoundResults}
        onReplay={handleGameResultsReplay}
        onHome={handleGameResultsHome}
      />
    );
  }

  if (screen === "sandbox") {
    return (
      <SandboxMode
        onExit={handleSandboxExit}
      />
    );
  }

  if (screen === "story" || screen === "lesson") {
    // Use LessonEngine for Act 1 (combines story + lesson)
    return <Act1LessonEngine onComplete={handleLessonComplete} />;
  }

  if (screen === "act2") {
    return <Act2LessonEngine onComplete={handleAct2Complete} />;
  }

  if (screen === "act3") {
    return <Act3LessonEngine onComplete={handleAct3Complete} />;
  }

  if (screen === "act4") {
    return <Act4LessonEngine onComplete={handleAct4Complete} />;
  }

  if (screen === "act5") {
    return <Act5LessonEngine onComplete={handleAct5Complete} />;
  }

  if (screen === "act6" || screen === "boss") {
    return <ChaosMergeBattle onComplete={handleAct6Complete} />;
  }

  if (screen === "map") {
    return (
      <AppShell>
        <GraphMap levels={levels} onSelectLevel={handleSelectLevel} />
      </AppShell>
    );
  }

  if (screen === "puzzle" && currentLevel) {
    if (currentLevel.type === "merge") {
      return (
        <PuzzleRoom
          level={currentLevel as MergeLevel}
          onComplete={handleCompleteLevel}
          onBack={handleBackToMap}
        />
      );
    } else if (currentLevel.type === "rebase") {
      return (
        <RebasePuzzleRoom
          level={currentLevel as RebaseLevel}
          onComplete={handleCompleteLevel}
          onBack={handleBackToMap}
        />
      );
    } else if (currentLevel.type === "cherry-pick") {
      return (
        <CherryPickPuzzleRoom
          level={currentLevel as CherryPickLevel}
          onComplete={handleCompleteLevel}
          onBack={handleBackToMap}
        />
      );
    }
  }

  return null;
};

export default Index;
