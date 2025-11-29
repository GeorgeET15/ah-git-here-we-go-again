/**
 * Act 6: Chaos Merge Boss Battle
 * Final boss fight - resolve multi-file merge conflicts under time pressure
 */

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/ui/layout";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { MultiFileConflictEditor } from "@/ui/components/editor";
import { conflictSystem, ConflictFile } from "@/game/logic/conflictSystem";
import { timerSystem } from "@/game/state/timer";
import { useGameStore } from "@/game/state/selectors";
import { motion, AnimatePresence } from "framer-motion";
import { screenShake, alarmBorder, countdownPulse, timelineFracture } from "@/ui/animation/bossEffects";
import { BugLordInterrupt } from "@/game/boss/BugLordInterrupts";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import chaosMergeData from "@/data/boss/chaosMerge.json";

interface ChaosMergeBattleProps {
  onComplete: () => void;
}

export const ChaosMergeBattle: React.FC<ChaosMergeBattleProps> = ({ onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(chaosMergeData.timeLimit);
  const [conflictFiles, setConflictFiles] = useState<ConflictFile[]>([]);
  const [interruptMessage, setInterruptMessage] = useState<string | null>(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const [shake, setShake] = useState(false);
  const [battlePhase, setBattlePhase] = useState<"intro" | "battle" | "victory" | "defeat">("intro");
  const { addTerminalLine, clearTerminal, terminalLines } = useGameStore();
  const [lastInterruptTime, setLastInterruptTime] = useState(0);

  // Initialize battle
  useEffect(() => {
    conflictSystem.loadBossData(chaosMergeData as any);
    setConflictFiles(conflictSystem.getConflictedFiles());
    
    // Start timer after intro
    setTimeout(() => {
      setBattlePhase("battle");
      timerSystem.start(chaosMergeData.timeLimit);
    }, 2000);
  }, []);

  // Timer updates
  useEffect(() => {
    if (battlePhase !== "battle") return;

    const unsubscribe = timerSystem.onTick((time) => {
      setTimeRemaining(time);
      
      // Time-based interrupts
      if (time === 120 && Date.now() - lastInterruptTime > 5000) {
        triggerInterrupt("Tick tock! Your timeline is fracturing!");
      } else if (time === 60 && Date.now() - lastInterruptTime > 5000) {
        triggerInterrupt("Time is running out! The chaos grows!");
      } else if (time === 30 && Date.now() - lastInterruptTime > 5000) {
        triggerInterrupt("MUAHAHAHA! Your precious timeline collapses!");
      }
    });

    const expireUnsubscribe = timerSystem.onExpire(() => {
      setBattlePhase("defeat");
      addTerminalLine({ type: "error", text: "Time expired! The repository collapsed." });
    });

    return () => {
      unsubscribe();
      expireUnsubscribe();
    };
  }, [battlePhase, lastInterruptTime, addTerminalLine]);

  const triggerInterrupt = useCallback((message: string) => {
    setInterruptMessage(message);
    setShowInterrupt(true);
    setLastInterruptTime(Date.now());
  }, []);

  const handleInterruptComplete = useCallback(() => {
    setShowInterrupt(false);
    setInterruptMessage(null);
  }, []);

  const handleResolve = useCallback((
    filename: string,
    conflictId: string,
    resolution: "current" | "incoming" | "both"
  ) => {
    const isCorrect = conflictSystem.resolveConflict(filename, conflictId, resolution);
    
    if (isCorrect) {
      addTerminalLine({ type: "success", text: `✓ Resolved conflict in ${filename}` });
      setConflictFiles([...conflictSystem.getConflictedFiles()]);
      
      const progress = conflictSystem.getProgress();
      if (progress.filesResolved === 1 && Date.now() - lastInterruptTime > 3000) {
        triggerInterrupt("One down, but chaos remains!");
      }
      
      // Check if all resolved
      if (conflictSystem.areAllResolved()) {
        addTerminalLine({ type: "success", text: "All conflicts resolved! Stage and commit to finish." });
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      timerSystem.addPenalty(10);
      addTerminalLine({ type: "error", text: `✗ Wrong resolution for ${filename}. Try again.` });
      
      if (Date.now() - lastInterruptTime > 3000) {
        triggerInterrupt("Wrong choice! Try again, engineer.");
      }
    }
  }, [addTerminalLine, lastInterruptTime, triggerInterrupt, onComplete]);

  const handleMistake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
    timerSystem.addPenalty(10);
    
    if (Date.now() - lastInterruptTime > 3000) {
      triggerInterrupt("Wrong choice! Try again, engineer.");
    }
  }, [lastInterruptTime, triggerInterrupt]);

  const handleCommand = useCallback((command: string) => {
    const cmd = command.trim();
    addTerminalLine({ type: "command", text: cmd });

    if (cmd === "git merge feature/ui feature/api hotfix/crash" || cmd.includes("git merge")) {
      addTerminalLine({ type: "output", text: "Merging branches..." });
      addTerminalLine({ type: "error", text: "CONFLICT: Multiple files need resolution" });
      addTerminalLine({ type: "output", text: "Conflicted files: auth.js, ui.tsx, kernel.cpp" });
      addTerminalLine({ type: "output", text: "Resolve conflicts in the editor above" });
      addTerminalLine({ type: "output", text: "" });
    } else if (cmd.startsWith("git add")) {
      const filename = cmd.split(" ")[2];
      const file = conflictFiles.find(f => f.filename === filename);
      if (file?.resolved) {
        addTerminalLine({ type: "success", text: `Staged ${filename}` });
      } else {
        addTerminalLine({ type: "error", text: `Cannot stage ${filename} - conflicts not resolved` });
        handleMistake();
      }
    } else if (cmd === "git commit" || cmd.startsWith("git commit")) {
      if (conflictSystem.areAllResolved()) {
        addTerminalLine({ type: "success", text: "All conflicts resolved! Committing..." });
        addTerminalLine({ type: "success", text: "[main abc123] Merge branches" });
        addTerminalLine({ type: "success", text: "🎉 Repository stabilized!" });
        setBattlePhase("victory");
        timerSystem.stop();
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        addTerminalLine({ type: "error", text: "Cannot commit - unresolved conflicts remain" });
        handleMistake();
      }
    } else {
      addTerminalLine({ type: "error", text: "Command not recognized. Focus on resolving conflicts!" });
    }
  }, [addTerminalLine, conflictFiles, onComplete, handleMistake]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = conflictSystem.getProgress();
  const isLowTime = timeRemaining <= 30;
  const isWarningTime = timeRemaining <= 60;

  if (battlePhase === "intro") {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Heading level={1} className="mb-4 text-error">CHAOS MERGE ACTIVATED</Heading>
            <Text size="lg" className="mb-8">
              Multiple branches collide! Resolve all conflicts before time runs out.
            </Text>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  if (battlePhase === "victory") {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <CheckCircle className="w-16 h-16 text-success mx-auto" />
            <Heading level={1} className="text-success">VICTORY!</Heading>
            <Text size="lg">You saved the repository!</Text>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  if (battlePhase === "defeat") {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <AlertCircle className="w-16 h-16 text-error mx-auto" />
            <Heading level={1} className="text-error">DEFEAT</Heading>
            <Text size="lg">Time ran out. The repository collapsed.</Text>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div
        animate={shake ? "visible" : "normal"}
        variants={{
          visible: screenShake.visible,
          normal: { x: 0, y: 0 },
        }}
        className="relative"
      >
        {/* BugLord Interrupt Overlay */}
        <BugLordInterrupt
          message={interruptMessage || ""}
          show={showInterrupt}
          onComplete={handleInterruptComplete}
        />

        {/* Timer and Progress Bar */}
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            animate={isLowTime ? "visible" : "normal"}
            variants={countdownPulse}
          >
            <Clock className="w-5 h-5" />
            <Text size="lg" weight="bold" className={isLowTime ? "text-error" : ""}>
              {formatTime(timeRemaining)}
            </Text>
          </motion.div>

          <div className="flex items-center gap-4">
            <Text size="sm" variant="muted">
              Progress: {progress.filesResolved}/{progress.filesTotal} files
            </Text>
            <Text size="sm" variant="muted">
              Conflicts: {progress.resolved}/{progress.total}
            </Text>
          </div>
        </div>

        {/* Alarm Border when time is low */}
        <motion.div
          animate={isWarningTime ? "visible" : "normal"}
          variants={alarmBorder}
          className="border-2 rounded-lg p-1"
        >
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <Heading level={2} className="mb-2 text-error">CHAOS MERGE BATTLE</Heading>
              <Text variant="muted">
                Resolve all conflicts before time runs out!
              </Text>
            </div>

            {/* Multi-File Editor */}
            <MultiFileConflictEditor
              files={conflictFiles}
              onResolve={handleResolve}
            />

            {/* Terminal */}
            <TerminalWindow height={300}>
              <GuidedTerminal
                suggestions={[
                  { command: "git merge feature/ui feature/api hotfix/crash", hint: "Trigger the merge" },
                  { command: "git add auth.js", hint: "Stage resolved file" },
                  { command: "git commit", hint: "Complete the merge" },
                ]}
                onCommand={handleCommand}
                useGlobalStore={true}
              />
            </TerminalWindow>

            {/* Timeline Visualization (Fractured) */}
            <motion.div
              animate="visible"
              variants={timelineFracture}
            >
              <Panel>
                <PanelHeader>
                  <Text size="sm" weight="semibold">Timeline Status</Text>
                </PanelHeader>
                <PanelContent>
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                    <Text variant="error" weight="semibold">Timeline Fractured</Text>
                    <Text size="sm" variant="muted" className="mt-2">
                      Resolve conflicts to stabilize
                    </Text>
                  </div>
                </PanelContent>
              </Panel>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

