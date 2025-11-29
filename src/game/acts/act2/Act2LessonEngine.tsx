/**
 * Act 2 Lesson - Using LessonEngine
 */

import React, { useState, useEffect } from "react";
import {
  LessonEngineProvider,
  LessonStepRenderer,
  useLessonEngine,
} from "@/game/lessonEngine";
import { AppShell } from "@/ui/layout";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text, Code } from "@/ui/components/Typography";
import { InfoBanner } from "@/ui/components/Feedback";
import { useGameStore } from "@/game/state/selectors";
import { GitBranch } from "lucide-react";
import { useGameStore as useGameStoreFull } from "@/game/state/gameStore";
import { motion } from "framer-motion";
import {
  commitNodeAppear,
  branchLineDraw,
  branchLineVertical,
  branchLineHorizontal,
  mergeConnection,
  timelineStagger,
} from "@/game/animations/timelineAnimations";
import { fadeInUp } from "@/ui/animation/motionPresets";
import { lessonEventBus } from "@/game/lessonEngine/events";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { TerminalWindow } from "@/ui/components/TerminalWindow";

interface Act2LessonEngineProps {
  onComplete: () => void;
}

const Act2LessonContent: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { currentStep, state, handleCommand, getSuggestions } =
    useLessonEngine();
  const { terminalLines, addTerminalLine, clearTerminal } = useGameStore();
  const { setActState } = useGameStoreFull();
  const [currentBranch, setCurrentBranch] = useState("main");
  const [hasBranch, setHasBranch] = useState(false);
  const [hasMerged, setHasMerged] = useState(false);
  const [hasFeatureCommit, setHasFeatureCommit] = useState(false);

  // Set act state when Act 2 starts
  useEffect(() => {
    setActState("act2");
  }, [setActState]);

  // Listen to lesson engine events for timeline updates
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Listen to timeline events
    const unsubBranchCreated = lessonEventBus.on(
      "timeline.branchCreated",
      () => {
        setHasBranch(true);
      }
    );
    unsubscribers.push(unsubBranchCreated);

    const unsubBranchMerged = lessonEventBus.on("timeline.branchMerged", () => {
      setHasMerged(true);
    });
    unsubscribers.push(unsubBranchMerged);

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  // Update branch based on command success events and terminal output
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Listen to command success events for checkout commands
    const unsubCommandSuccess = lessonEventBus.on(
      "command.success",
      (payload: any) => {
        const command = payload?.command || "";

        // Check for git checkout feature-login
        if (
          command.includes("git checkout feature-login") ||
          command.includes("git checkout 'feature-login'")
        ) {
          setCurrentBranch("feature-login");
        }
        // Check for git checkout main
        else if (
          command.includes("git checkout main") ||
          command.includes("git checkout 'main'")
        ) {
          setCurrentBranch("main");
        }
      }
    );
    unsubscribers.push(unsubCommandSuccess);

    // Fallback: Also check terminal lines for branch switch messages
    if (
      terminalLines.some(
        (l) =>
          l.text.includes("Switched to branch 'feature-login'") ||
          l.text.includes('Switched to branch "feature-login"')
      )
    ) {
      setCurrentBranch("feature-login");
    } else if (
      terminalLines.some(
        (l) =>
          l.text.includes("Switched to branch 'main'") ||
          l.text.includes('Switched to branch "main"') ||
          l.text.includes("Already on 'main'")
      )
    ) {
      setCurrentBranch("main");
    }

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [terminalLines]);

  // Persist timeline states from terminal (fallback)
  useEffect(() => {
    // Once branch is created, it stays created
    if (
      !hasBranch &&
      terminalLines.some((l) => l.text.includes("Created branch"))
    ) {
      setHasBranch(true);
    }

    // Once merged, it stays merged
    if (
      !hasMerged &&
      terminalLines.some((l) => l.text.includes("Branch merged successfully"))
    ) {
      setHasMerged(true);
    }

    // Once feature commit exists, it stays
    if (
      !hasFeatureCommit &&
      terminalLines.some((l) => l.text.includes("Add login feature"))
    ) {
      setHasFeatureCommit(true);
    }
  }, [terminalLines, hasBranch, hasMerged, hasFeatureCommit]);

  // Initialize terminal output when terminal step starts - only clear on first step
  useEffect(() => {
    if (currentStep?.type === "terminal") {
      const terminalStep = currentStep as any;
      const initialOutput = terminalStep.initialOutput || [];

      // Only clear terminal on the very first terminal step
      if (
        currentStep.id === "terminal-create-branch" &&
        terminalLines.length === 0
      ) {
        clearTerminal();
      }

      // Only add initial output if terminal is empty or it's a new step
      if (initialOutput && initialOutput.length > 0) {
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

  // Show UI during terminal and concept steps
  const showUI =
    currentStep?.type === "terminal" || currentStep?.type === "concept";

  // Keep terminal visible once it's been shown (for terminal or concept steps)
  const showTerminal =
    currentStep?.type === "terminal" || currentStep?.type === "concept";

  return (
    <>
      {showUI && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Heading level={2} className="mb-2">
              Branching & Merging
            </Heading>
            <Text variant="muted">
              Create a feature branch, make changes, and merge back to main
            </Text>
          </div>

          {/* Current Branch Indicator - Enhanced */}
          <Panel className="bg-primary/10 border-primary/30">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <GitBranch className="w-5 h-5 text-primary" />
                <div>
                  <Text
                    size="xs"
                    variant="muted"
                    className="uppercase tracking-wide"
                  >
                    Current Branch
                  </Text>
                  <div className="flex items-center gap-2 mt-1">
                    <Code className="text-lg font-bold">{currentBranch}</Code>
                    {currentBranch === "feature-login" && (
                      <motion.span
                        className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-xs font-semibold rounded"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        Feature Branch
                      </motion.span>
                    )}
                    {currentBranch === "main" && (
                      <motion.span
                        className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-semibold rounded"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        Main Branch
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
              <motion.div
                className="px-3 py-1 bg-background/50 rounded border border-border"
                animate={{
                  boxShadow: [
                    "0 0 0px hsl(var(--primary))",
                    "0 0 10px hsl(var(--primary))",
                    "0 0 0px hsl(var(--primary))",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Text
                  size="sm"
                  className="font-mono font-semibold text-primary"
                >
                  {currentBranch === "main" ? "main" : "feature-login"}
                </Text>
              </motion.div>
            </div>
          </Panel>

          {/* Terminal and Timeline side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Terminal - Keep visible once shown */}
            {showTerminal && (
              <Panel className="flex flex-col">
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
            <Panel className="flex flex-col">
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
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={timelineStagger}
                  className="w-full"
                >
                  <svg
                    width="100%"
                    height="300"
                    viewBox="0 0 500 300"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Main branch baseline */}
                    <motion.line
                      x1="50"
                      y1="80"
                      x2="450"
                      y2="80"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      variants={branchLineDraw}
                      className="drop-shadow-sm"
                    />

                    {/* Initial commit on main */}
                    <motion.circle
                      cx="100"
                      cy="80"
                      r="16"
                      fill="hsl(var(--primary))"
                      variants={commitNodeAppear}
                      className="drop-shadow-lg"
                    />
                    <motion.text
                      x="100"
                      y="60"
                      textAnchor="middle"
                      fill="hsl(var(--primary))"
                      fontSize="14"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      A
                    </motion.text>
                    <motion.text
                      x="100"
                      y="105"
                      textAnchor="middle"
                      fill="hsl(var(--muted-foreground))"
                      fontSize="11"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Initial commit
                    </motion.text>

                    {/* Feature branch - vertical connection (smooth curve) */}
                    {hasBranch && (
                      <motion.path
                        d="M 100 80 Q 100 130 100 180"
                        stroke="hsl(var(--accent-cyan))"
                        strokeWidth="3"
                        fill="none"
                        variants={branchLineVertical}
                        className="drop-shadow-sm"
                      />
                    )}

                    {/* Feature branch - horizontal line */}
                    {hasBranch && (
                      <motion.line
                        x1="100"
                        y1="180"
                        x2="350"
                        y2="180"
                        stroke="hsl(var(--accent-cyan))"
                        strokeWidth="3"
                        variants={branchLineHorizontal}
                        className="drop-shadow-sm"
                      />
                    )}

                    {/* Feature branch label */}
                    {hasBranch && (
                      <motion.text
                        x="380"
                        y="185"
                        fill="hsl(var(--accent-cyan))"
                        fontSize="13"
                        fontWeight="bold"
                        initial={{ opacity: 0, x: 380, y: 185 }}
                        animate={{ opacity: 1, x: 380, y: 185 }}
                        transition={{
                          delay: 0.8,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        feature-login
                      </motion.text>
                    )}

                    {/* Feature branch commit */}
                    {hasFeatureCommit && (
                      <>
                        <motion.circle
                          cx="250"
                          cy="180"
                          r="16"
                          fill="hsl(var(--accent-cyan))"
                          variants={commitNodeAppear}
                          className="drop-shadow-lg"
                        />
                        <motion.text
                          x="250"
                          y="160"
                          textAnchor="middle"
                          fill="hsl(var(--accent-cyan))"
                          fontSize="14"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          B
                        </motion.text>
                        <motion.text
                          x="250"
                          y="205"
                          textAnchor="middle"
                          fill="hsl(var(--muted-foreground))"
                          fontSize="11"
                          fontWeight="medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          Add login
                        </motion.text>
                      </>
                    )}

                    {/* Merge connection line - smoother curve */}
                    {hasMerged && (
                      <motion.path
                        d="M 250 180 Q 200 130 250 80"
                        stroke="hsl(var(--success))"
                        strokeWidth="4"
                        fill="none"
                        variants={mergeConnection}
                        className="drop-shadow-md"
                      />
                    )}

                    {/* Merged commit on main */}
                    {hasMerged && (
                      <motion.circle
                        cx="250"
                        cy="80"
                        r="16"
                        fill="hsl(var(--success))"
                        variants={commitNodeAppear}
                        className="drop-shadow-lg"
                      />
                    )}
                    {hasMerged && (
                      <motion.text
                        x="250"
                        y="60"
                        textAnchor="middle"
                        fill="hsl(var(--success))"
                        fontSize="14"
                        fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        B
                      </motion.text>
                    )}
                    {hasMerged && (
                      <motion.text
                        x="250"
                        y="105"
                        textAnchor="middle"
                        fill="hsl(var(--muted-foreground))"
                        fontSize="11"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        Merged
                      </motion.text>
                    )}

                    {/* Branch labels */}
                    <motion.text
                      x="50"
                      y="100"
                      fill="hsl(var(--primary))"
                      fontSize="13"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      main
                    </motion.text>
                  </svg>
                </motion.div>
              </PanelContent>
            </Panel>
          </div>
        </div>
      )}

      {/* Lesson Step Renderer - Hide when step is terminal (we handle it ourselves) */}
      {currentStep?.type !== "terminal" && (
        <LessonStepRenderer onComplete={onComplete} />
      )}
    </>
  );
};

export const Act2LessonEngine: React.FC<Act2LessonEngineProps> = ({
  onComplete,
}) => {
  return (
    <LessonEngineProvider actId={2}>
      <AppShell>
        <Act2LessonContent onComplete={onComplete} />
      </AppShell>
    </LessonEngineProvider>
  );
};
