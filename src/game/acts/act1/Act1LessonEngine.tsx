/**
 * Act 1 Lesson - Game Mode
 * Immersive game-like experience with mission objectives and visual feedback
 */

import React, { useState, useEffect } from "react";
import {
  LessonEngineProvider,
  LessonStepRenderer,
  useLessonEngine,
} from "@/game/lessonEngine";
import { AppShell } from "@/ui/layout";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { GitBranch, Target, CheckCircle2, AlertCircle } from "lucide-react";
import { useGameStore } from "@/game/state/selectors";
import { motion } from "framer-motion";
import {
  commitNodeAppear,
  branchLineDraw,
} from "@/game/animations/timelineAnimations";
import { fadeInUp } from "@/ui/animation/motionPresets";
import { GlitchOverlay } from "@/components/cinematic/GlitchOverlay";
import { ParticleSystem } from "@/components/cinematic/ParticleSystem";
import { lessonEventBus } from "@/game/lessonEngine/events";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { Act1UITour } from "@/components/tour/Act1UITour";

interface Act1LessonEngineProps {
  onComplete: () => void;
}

const Act1LessonContent: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { currentStep, state, handleCommand, getSuggestions, nextStep } =
    useLessonEngine();
  const [glitchEnabled, setGlitchEnabled] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(false);
  const { terminalLines, addTerminalLine, clearTerminal } = useGameStore();

  // Game state
  const [stability, setStability] = useState(0);
  const [objectives, setObjectives] = useState([
    { id: "init", text: "Initialize Git repository", completed: false },
    { id: "fix", text: "Fix the broken code", completed: false },
    { id: "commit", text: "Create your first commit", completed: false },
  ]);
  const [commitData, setCommitData] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStaged, setIsStaged] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Track completed objectives to prevent duplicate updates
  const [completedObjectiveIds, setCompletedObjectiveIds] = useState<
    Set<string>
  >(new Set());

  // Listen to lesson engine events for objectives and timeline updates
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Listen to command success events
    const unsubCommandSuccess = lessonEventBus.on(
      "command.success",
      (payload: any) => {
        const command = payload?.command || "";

        // Check for git init
        if (
          command.includes("git init") &&
          !completedObjectiveIds.has("init")
        ) {
          setObjectives((prev) =>
            prev.map((obj) =>
              obj.id === "init" ? { ...obj, completed: true } : obj
            )
          );
          setCompletedObjectiveIds((prev) => new Set(prev).add("init"));
          setStability(25);
        }

        // Check for git commit
        if (
          command.includes("git commit") &&
          !completedObjectiveIds.has("commit")
        ) {
          setObjectives((prev) =>
            prev.map((obj) =>
              obj.id === "commit" ? { ...obj, completed: true } : obj
            )
          );
          setCompletedObjectiveIds((prev) => new Set(prev).add("commit"));
          setStability(100);
        }
      }
    );
    unsubscribers.push(unsubCommandSuccess);

    // Listen to timeline events
    const unsubTimelineInit = lessonEventBus.on("timeline.initialize", () => {
      setIsInitialized(true);
    });
    unsubscribers.push(unsubTimelineInit);

    const unsubTimelineStage = lessonEventBus.on("timeline.stage", () => {
      setIsStaged(true);
    });
    unsubscribers.push(unsubTimelineStage);

    const unsubTimelineCommit = lessonEventBus.on(
      "timeline.addCommit",
      (payload: any) => {
        if (payload?.commitId && payload?.message) {
          setCommitData({
            id: payload.commitId,
            message: payload.message,
          });
        }
      }
    );
    unsubscribers.push(unsubTimelineCommit);

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [completedObjectiveIds]);

  // Show tour when Act 1 starts (first terminal step)
  useEffect(() => {
    if (
      currentStep?.type === "terminal" &&
      currentStep.id === "terminal-init"
    ) {
      // Check if tour was already shown
      const tourShown = localStorage.getItem("act1-tour-shown");
      if (!tourShown) {
        // Small delay to let UI render
        setTimeout(() => {
          setShowTour(true);
        }, 500);
      }
    }
  }, [currentStep?.id, currentStep?.type]);

  // Initialize terminal output when terminal step starts
  // Only clear terminal if it's the first terminal step, otherwise append
  useEffect(() => {
    if (currentStep?.type === "terminal") {
      const terminalStep = currentStep as any;
      const initialOutput = terminalStep.initialOutput || [];

      // Only clear terminal on the very first terminal step (init)
      if (currentStep.id === "terminal-init" && terminalLines.length === 0) {
        clearTerminal();
      }

      // Only add initial output if terminal is empty or it's a new step
      if (initialOutput && initialOutput.length > 0) {
        // Check if we already have this step's initial output
        const hasInitialOutput = terminalLines.some((line) =>
          initialOutput.some((initLine: any) => line.text === initLine.text)
        );

        if (!hasInitialOutput) {
          initialOutput.forEach((line: any) => {
            addTerminalLine(line);
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep?.id, currentStep?.type]);

  // Handle visual effects based on step and terminal output (fallback tracking)
  useEffect(() => {
    // Objective 2: Fix the code - check for success message from editor
    if (
      !completedObjectiveIds.has("fix") &&
      terminalLines.some(
        (l) =>
          l.text.includes("Code fixed") ||
          l.text.includes("function now works correctly")
      )
    ) {
      setObjectives((prev) =>
        prev.map((obj) =>
          obj.id === "fix" ? { ...obj, completed: true } : obj
        )
      );
      setCompletedObjectiveIds((prev) => new Set(prev).add("fix"));
      setStability(50);
    }

    // Fallback: Update isInitialized from terminal lines if not set by event
    // Once initialized, it stays initialized (don't reset)
    if (
      !isInitialized &&
      terminalLines.some((l) =>
        l.text.includes("Initialized empty Git repository")
      )
    ) {
      setIsInitialized(true);
    }

    // Once staged, it stays staged (don't reset)
    if (
      !isStaged &&
      terminalLines.some(
        (l) =>
          l.text.includes("Changes staged") ||
          l.text.includes("staged for commit")
      )
    ) {
      setIsStaged(true);
    }

    // Particles for commit celebration
    if (
      currentStep?.type === "terminal" &&
      currentStep.id === "terminal-commit"
    ) {
      setParticlesEnabled(true);
      setTimeout(() => setParticlesEnabled(false), 2000);
    }
  }, [currentStep, terminalLines, state, completedObjectiveIds, isInitialized]);

  // Show editor/timeline when we're in terminal or editor steps
  const showEditor =
    currentStep?.type === "terminal" ||
    currentStep?.type === "editor" ||
    currentStep?.type === "concept" ||
    (currentStep?.type === "dialog" && state.currentStepIndex > 3);

  // Keep terminal visible once it's been shown (for terminal, concept, or dialog steps)
  const showTerminal =
    currentStep?.type === "terminal" ||
    currentStep?.type === "editor" ||
    currentStep?.type === "concept" ||
    (currentStep?.type === "dialog" && state.currentStepIndex > 3);

  // Check for commit - only show if commitData is set (from timeline.addCommit event)
  // Don't check terminal lines as they might contain the message in hints or other contexts
  const hasCommit = commitData !== null;

  const completedObjectives = objectives.filter((obj) => obj.completed).length;

  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem("act1-tour-shown", "true");
  };

  return (
    <div className="relative min-h-full flex flex-col">
      {showTour && <Act1UITour onComplete={handleTourComplete} />}

      <div className="flex-1 flex flex-col">
        {/* Mission Objectives and Stats - Compact */}
        <div
          className="bg-card border-b border-border px-4 py-2 flex-shrink-0"
          data-tour="objectives"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Target className="w-3 h-3 text-primary flex-shrink-0" />
              <h3 className="text-xs font-bold text-foreground font-mono">
                OBJECTIVES:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {objectives.map((obj, index) => (
                  <motion.div
                    key={obj.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border ${
                      obj.completed
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-muted/50 text-muted-foreground border-border"
                    }`}
                  >
                    {obj.completed ? (
                      <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full border border-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className="whitespace-nowrap">{obj.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground font-mono">
                  STABILITY:
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-error via-warning to-success"
                      initial={{ width: 0 }}
                      animate={{ width: `${stability}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary font-mono">
                    {stability}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showEditor && (
          <div className="flex-1 flex flex-col p-6 space-y-6">
            {/* Main Game Area */}
            <GlitchOverlay enabled={glitchEnabled} intensity={0.3}>
              <div className="flex flex-col gap-6 relative">
                {/* Bottom Row: Terminal and Timeline side by side */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Terminal - Keep visible once shown */}
                  {showTerminal && (
                    <Panel className="flex flex-col" data-tour="terminal">
                      <PanelHeader className="flex-shrink-0 py-3">
                        <Text size="sm" variant="muted" className="font-mono">
                          Terminal
                        </Text>
                      </PanelHeader>
                      <PanelContent
                        padding="none"
                        style={{ minHeight: "400px", maxHeight: "500px" }}
                      >
                        {currentStep?.type === "terminal" ? (
                          <TerminalWindow height={400}>
                            <GuidedTerminal
                              suggestions={getSuggestions()}
                              onCommand={(cmd) => {
                                const result = handleCommand(cmd);
                                // Add output to terminal if available
                                if (result.output && result.output.length > 0) {
                                  result.output.forEach((line: any) => {
                                    addTerminalLine(line);
                                  });
                                }
                              }}
                              useGlobalStore={true}
                            />
                          </TerminalWindow>
                        ) : (
                          <div className="p-4 font-mono text-sm space-y-1 overflow-y-auto h-full">
                            {terminalLines.map((line, i) => (
                              <div
                                key={i}
                                className={
                                  line.type === "error"
                                    ? "text-error"
                                    : line.type === "success"
                                    ? "text-success"
                                    : line.type === "info"
                                    ? "text-primary"
                                    : "text-foreground"
                                }
                              >
                                {line.text}
                              </div>
                            ))}
                            {terminalLines.length === 0 && (
                              <div className="text-muted-foreground">
                                Terminal output will appear here...
                              </div>
                            )}
                          </div>
                        )}
                      </PanelContent>
                    </Panel>
                  )}

                  {/* Timeline Visualization */}
                  <Panel className="flex flex-col" data-tour="timeline">
                    <PanelHeader className="flex-shrink-0 py-3">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-primary" />
                        <Text size="sm" weight="semibold">
                          Commit Timeline
                        </Text>
                      </div>
                    </PanelHeader>
                    <PanelContent
                      className="flex items-center justify-center"
                      style={{ minHeight: "400px" }}
                    >
                      {/* Progressive timeline that builds up and doesn't reset */}
                      {hasCommit ? (
                        <motion.svg
                          width="100%"
                          height="120"
                          initial="hidden"
                          animate="visible"
                          key={commitData?.id || "commit"}
                        >
                          {/* Branch line - always shown once initialized */}
                          <motion.line
                            x1="20"
                            y1="60"
                            x2="280"
                            y2="60"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            variants={branchLineDraw}
                          />
                          {/* Staged indicator (if staged) */}
                          {isStaged && (
                            <motion.circle
                              cx="80"
                              cy="60"
                              r="10"
                              fill="hsl(var(--warning))"
                              variants={commitNodeAppear}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            />
                          )}
                          {/* Commit node */}
                          <motion.circle
                            cx="150"
                            cy="60"
                            r="16"
                            fill="hsl(var(--success))"
                            variants={commitNodeAppear}
                            className="drop-shadow-lg"
                          />
                          <motion.text
                            x="150"
                            y="40"
                            textAnchor="middle"
                            fill="hsl(var(--success))"
                            fontSize="14"
                            fontWeight="bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {commitData?.id || "a1b2c3d"}
                          </motion.text>
                          <motion.text
                            x="150"
                            y="90"
                            textAnchor="middle"
                            fill="hsl(var(--muted-foreground))"
                            fontSize="12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {commitData?.message || "Fix system crash"}
                          </motion.text>
                        </motion.svg>
                      ) : isStaged ? (
                        <motion.svg
                          width="100%"
                          height="120"
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Branch line - shown once initialized */}
                          {isInitialized && (
                            <motion.line
                              x1="20"
                              y1="60"
                              x2="280"
                              y2="60"
                              stroke="hsl(var(--primary))"
                              strokeWidth="3"
                              variants={branchLineDraw}
                            />
                          )}
                          {/* Staged indicator */}
                          <motion.circle
                            cx="150"
                            cy="60"
                            r="14"
                            fill="hsl(var(--warning))"
                            variants={commitNodeAppear}
                            className="drop-shadow-lg"
                          />
                          <motion.text
                            x="150"
                            y="40"
                            textAnchor="middle"
                            fill="hsl(var(--warning))"
                            fontSize="12"
                            fontWeight="bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            STAGED
                          </motion.text>
                          <motion.text
                            x="150"
                            y="90"
                            textAnchor="middle"
                            fill="hsl(var(--muted-foreground))"
                            fontSize="11"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            Ready to commit
                          </motion.text>
                        </motion.svg>
                      ) : isInitialized ? (
                        <motion.svg
                          width="100%"
                          height="120"
                          initial="hidden"
                          animate="visible"
                        >
                          {/* Branch line */}
                          <motion.line
                            x1="20"
                            y1="60"
                            x2="280"
                            y2="60"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            variants={branchLineDraw}
                          />
                          {/* Initialized indicator */}
                          <motion.circle
                            cx="150"
                            cy="60"
                            r="12"
                            fill="hsl(var(--primary))"
                            variants={commitNodeAppear}
                          />
                          <motion.text
                            x="150"
                            y="40"
                            textAnchor="middle"
                            fill="hsl(var(--primary))"
                            fontSize="12"
                            fontWeight="bold"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            INIT
                          </motion.text>
                          <motion.text
                            x="150"
                            y="90"
                            textAnchor="middle"
                            fill="hsl(var(--muted-foreground))"
                            fontSize="11"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            Repository ready
                          </motion.text>
                        </motion.svg>
                      ) : (
                        <motion.div
                          className="text-center"
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                        >
                          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <Text variant="muted" size="sm">
                            No repository yet
                          </Text>
                          <Text variant="muted" size="xs" className="mt-2">
                            Run git init to get started
                          </Text>
                        </motion.div>
                      )}
                    </PanelContent>
                  </Panel>
                </div>

                {/* Particles for commit celebration */}
                <ParticleSystem
                  enabled={particlesEnabled}
                  count={30}
                  color="hsl(var(--success))"
                  origin={{ x: 0.5, y: 0.5 }}
                />

                {/* Success Notification */}
                {hasCommit && (
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-success/10 border border-success/30 rounded-lg px-4 py-2 z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Text size="sm" className="text-success font-semibold">
                      STABILITY RESTORED — 100%
                    </Text>
                  </motion.div>
                )}
              </div>
            </GlitchOverlay>
          </div>
        )}

        {/* Lesson Step Renderer - Hide when step is terminal (we handle it ourselves) */}
        {/* Editor steps are handled by StepEditorTask which includes the save button */}
        {currentStep?.type !== "terminal" && (
          <div className="flex-shrink-0">
            <LessonStepRenderer onComplete={onComplete} />
          </div>
        )}
      </div>
    </div>
  );
};

export const Act1LessonEngine: React.FC<Act1LessonEngineProps> = ({
  onComplete,
}) => {
  return (
    <LessonEngineProvider actId={1}>
      <AppShell>
        <Act1LessonContent onComplete={onComplete} />
      </AppShell>
    </LessonEngineProvider>
  );
};
