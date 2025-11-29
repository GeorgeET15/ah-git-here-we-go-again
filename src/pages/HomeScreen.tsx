import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGameStore } from "@/game/state/gameStore";
import {
  useCompletedActs,
  useIsActComplete,
  useIsSandboxUnlocked,
  useIsChallengeUnlocked,
  navigateToScreen,
} from "@/game/state/selectors";
import { useSettingsStore } from "@/game/state/settingsStore";
import {
  WireframeGrid,
  GlitchOverlay,
  ProgressionRoadmap,
  MissionBriefingPanel,
  SystemModuleCard,
} from "@/components/cinematic";

interface HomeScreenProps {
  onStartTutorial: () => void;
  onStartGame: () => void;
  onStartSandbox?: () => void;
}

const heroBriefingText = `Ah Git… here we go again.

Another Friday. Another broken main branch. Another developer who thought "it works on my machine" was good enough.

This time, it's different. This time, you're going to learn Git the hard way—by fixing disasters before they destroy your career.

Break repos. Fix chaos. Learn Git — one disaster at a time.`;

const missionStoryText = `The Situation

Someone pushed to main. On a Friday. Without testing. The cascade failure hit every repo connected to it. Without version control, there's no way back.

What You'll Learn

Git isn't just commands—it's survival skills. You'll learn to:
• Save snapshots (commits) before things break
• Create parallel timelines (branches) to test fixes
• Merge solutions back safely
• Rewrite history when you need to

The Mission

Five acts. Five disasters. Each one teaches you Git commands by actually using them. No theory, just fixing real problems.`;

const tutorialDescription = `Story Mode: Five acts that teach you Git by fixing disasters.

You'll learn: init, add, commit, branch, merge, rebase, cherry-pick, and how to handle conflicts when timelines collide.

Guided terminal sessions with a visual timeline so you see exactly what each command does.`;

const challengeDescription = `Disaster Arena: Random Git emergencies. Time pressure. Score tracking.

10 different scenarios that test everything you learned. Can you fix them fast enough?

Unlocks after completing all 5 story acts.`;

const sandboxDescription = `Breakroom Lab: Break things. Learn. No consequences.

Full Git playground with visual commit graph, editor, and terminal. Try any command. See what happens.

Unlocks after Act 2.`;

// Terminal console messages for the looping panel
const terminalMessages = [
  "fatal: roleplay.conflict detected",
  "warning: coffee level low",
  "hint: never trust 'git push --force'",
  "merge conflict: emotions not resolved",
  "error: main branch is on fire",
  "warning: deploying on Friday detected",
  "fatal: forgot to pull before push",
  "hint: 'git reset --hard' is not a solution",
  "error: merge conflict with reality",
  "warning: too many tabs open",
  "fatal: forgot what branch I'm on",
  "hint: always commit before going home",
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartTutorial,
  onStartGame,
  onStartSandbox,
}) => {
  // Legacy access still available via useGameStore if needed,
  // but progression should come from typed selectors.
  const act1Complete = useIsActComplete(1);
  const act2Complete = useIsActComplete(2);
  const act3Complete = useIsActComplete(3);
  const act4Complete = useIsActComplete(4);
  const act5Complete = useIsActComplete(5);

  const completedActsArray = useCompletedActs();
  const isGameModeUnlocked = useIsChallengeUnlocked();
  const isSandboxUnlocked = useIsSandboxUnlocked();

  const { playerName, setPlayerName } = useSettingsStore();
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [nameInput, setNameInput] = useState(playerName || "");
  const [currentTerminalMessage, setCurrentTerminalMessage] = useState(0);
  const terminalIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate terminal messages
  useEffect(() => {
    terminalIntervalRef.current = setInterval(() => {
      setCurrentTerminalMessage((prev) => (prev + 1) % terminalMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => {
      if (terminalIntervalRef.current) {
        clearInterval(terminalIntervalRef.current);
      }
    };
  }, []);

  const handleStartTutorialClick = () => {
    setShowNameDialog(true);
  };

  const handleNameSubmit = () => {
    const trimmedName = nameInput.trim();
    if (trimmedName) {
      setPlayerName(trimmedName);
      setShowNameDialog(false);
      onStartTutorial();
    }
  };

  const act1Unlocked = true; // Always unlocked
  const act2Unlocked = act1Complete;
  const act3Unlocked = act2Complete;
  const act4Unlocked = act3Complete;
  const act5Unlocked = act4Complete;

  const completedActs = completedActsArray.length;

  const handleActClick = (actNumber: number) => {
    console.log("🟡 [HomeScreen] handleActClick called with actNumber:", actNumber);
    console.log("🟡 [HomeScreen] act1Complete:", act1Complete);
    console.log("🟡 [HomeScreen] act2Complete:", act2Complete);
    console.log("🟡 [HomeScreen] act3Unlocked:", act3Unlocked);
    console.log("🟡 [HomeScreen] completedActsArray:", completedActsArray);
    
    // Map act number to screen
    const screenMap: Record<number, string> = {
      1: "lesson",
      2: "act2",
      3: "act3",
      4: "act4",
      5: "act5",
    };
    
    const screen = screenMap[actNumber] as any;
    console.log("🟡 [HomeScreen] Mapped screen:", screen);
    if (screen) {
      console.log("🟡 [HomeScreen] Calling navigateToScreen(", screen, ")");
      navigateToScreen(screen);
    } else {
      console.warn("🟡 [HomeScreen] No screen mapped for actNumber:", actNumber);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <WireframeGrid enabled={true} />
      <GlitchOverlay enabled={true} intensity={0.05} frequency={1000} />

      {/* Subtle green scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--success) / 0.3) 2px, hsl(var(--success) / 0.3) 4px)",
          }}
        />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 border-b border-success/20 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-mono text-xl font-bold text-success">
            AH GIT — HERE WE GO AGAIN
          </div>
          <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
            <span>Progress: {completedActs}/5 Acts</span>
            <span className="text-success">{completedActs === 5 ? "COMPLETE" : "IN PROGRESS"}</span>
          </div>
        </div>
      </div>

      {/* Hero Mission Briefing Section */}
      <div className="relative z-10 border-b border-success/10 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-foreground mb-4 font-mono"
            >
              AH GIT — HERE WE GO AGAIN
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground mb-2 font-mono"
            >
              A Git survival adventure
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground/80 mb-8 font-mono"
            >
              Master Git under pressure. Face merge conflicts like a boss.
            </motion.p>
            <div className="font-mono text-sm md:text-base text-muted-foreground/70 leading-relaxed mb-10 whitespace-pre-line max-w-2xl mx-auto">
              {heroBriefingText}
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleStartTutorialClick}
                size="lg"
                className="px-10 py-6 text-lg font-semibold bg-success hover:bg-success/90 text-success-foreground shadow-lg shadow-success/30 hover:shadow-xl hover:shadow-success/40 transition-all duration-300 font-mono"
              >
                START STORY MODE
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column: Mission Briefing Panel */}
          <MissionBriefingPanel
            storyText={missionStoryText}
            actProgress={{
              act1: act1Complete,
              act2: act2Complete,
              act3: act3Complete,
              act4: act4Complete,
              act5: act5Complete,
            }}
          />

          {/* Right Column: System Modules */}
          <div className="space-y-4">
            <SystemModuleCard
              title="STORY MODE"
              subtitle="Learn Git Through Acts"
              description={tutorialDescription}
              isUnlocked={true}
              onClick={handleStartTutorialClick}
              icon="tutorial"
            />
            <SystemModuleCard
              title="DISASTER ARENA"
              subtitle="Challenge Mode"
              description={challengeDescription}
              isUnlocked={isGameModeUnlocked}
              onClick={isGameModeUnlocked ? onStartGame : undefined}
              icon="challenge"
            />
            <SystemModuleCard
              title="BREAKROOM LAB"
              subtitle="Sandbox Mode"
              description={sandboxDescription}
              isUnlocked={isSandboxUnlocked}
              onClick={isSandboxUnlocked ? onStartSandbox : undefined}
              icon="sandbox"
            />
          </div>
        </div>
      </div>

      {/* Progression Roadmap */}
      <ProgressionRoadmap
        acts={[
          { label: "ACT 1", complete: act1Complete, unlocked: act1Unlocked },
          { label: "ACT 2", complete: act2Complete, unlocked: act2Unlocked },
          { label: "ACT 3", complete: act3Complete, unlocked: act3Unlocked },
          { label: "ACT 4", complete: act4Complete, unlocked: act4Unlocked },
          { label: "ACT 5", complete: act5Complete, unlocked: act5Unlocked },
        ]}
        arena={isGameModeUnlocked}
        lab={isSandboxUnlocked}
        onActClick={handleActClick}
      />

      {/* Name Input Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Welcome, Engineer!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your name to personalize your Git learning experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="player-name" className="text-foreground">
                Your Name
              </Label>
              <Input
                id="player-name"
                placeholder="Enter your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nameInput.trim()) {
                    handleNameSubmit();
                  }
                }}
                autoFocus
                className="bg-background border-border text-foreground focus:border-success"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNameDialog(false);
                setNameInput(playerName || "");
              }}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNameSubmit}
              disabled={!nameInput.trim()}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              Start Story Mode
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminal Console Panel */}
      <div className="relative z-10 container mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card/50 border border-success/20 rounded-lg p-4 font-mono"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-xs text-muted-foreground">SYSTEM CONSOLE</span>
          </div>
          <div className="h-20 overflow-hidden bg-black/50 rounded p-3 text-green-400 text-sm">
            <motion.div
              key={currentTerminalMessage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <span className="text-green-500">$</span>
              <span>{terminalMessages[currentTerminalMessage]}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-success/10 bg-card/50 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            Built with chaos & caffeine in Kochi
          </p>
        </div>
      </div>
    </div>
  );
};
