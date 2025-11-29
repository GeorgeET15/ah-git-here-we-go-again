/**
 * Sandbox Mode Component
 * Free-form Git experimentation environment
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/ui/layout";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/ui/components/fileExplorer";
import { SandboxEditor } from "@/ui/components/editor/SandboxEditor";
import { TimelineVisualizer } from "./TimelineVisualizer";
import { repoEnvironment } from "./repoEnvironment";
import { sandboxCommandHandlers } from "./commandHandlers";
import { useSandboxStore } from "./sandboxState";
import { useGameStore } from "@/game/state/selectors";
import {
  RotateCcw,
  Download,
  Upload,
  Lightbulb,
  Home,
  BookOpen,
} from "lucide-react";
import { fadeInUp } from "@/ui/animation/motionPresets";
import { SandboxTutorial } from "./SandboxTutorial";
// @ts-ignore - JSON imports
import simpleBlog from "./sampleRepos/simple-blog.json";
// @ts-ignore - JSON imports
import todoApp from "./sampleRepos/todo-app.json";

interface SandboxModeProps {
  onExit: () => void;
}

export const SandboxMode: React.FC<SandboxModeProps> = ({ onExit }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [repoInitialized, setRepoInitialized] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const { addTerminalLine, clearTerminal } = useGameStore();
  const {
    repoState,
    setRepoState,
    currentFile,
    setCurrentFile,
    showHints,
    setShowHints,
  } = useSandboxStore();

  // Update repo state
  const updateRepoState = useCallback(() => {
    const state = repoEnvironment.getState();
    setRepoState(state);
    setRepoInitialized(state.isInitialized);
  }, [setRepoState]);

  // Initialize on mount
  useEffect(() => {
    clearTerminal();
    addTerminalLine({ type: "output", text: "Welcome to Sandbox Mode!" });
    addTerminalLine({
      type: "output",
      text: "Experiment freely with Git commands.",
    });
    addTerminalLine({ type: "output", text: "" });
    updateRepoState();

    // Check if user has seen tutorial before
    // Show tutorial on first visit to Sandbox Mode
    const hasSeenTutorial =
      localStorage.getItem("sandbox-tutorial-seen") === "true";
    if (!hasSeenTutorial && showIntro) {
      // Show tutorial after a short delay when intro screen is shown
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCommand = useCallback(
    (command: string) => {
      const result = sandboxCommandHandlers.execute(command);

      // Add command to terminal
      addTerminalLine({ type: "command", text: command });

      // Add output
      result.lines.forEach((line) => {
        addTerminalLine(line);
      });

      // Update state if needed
      if (result.updateState) {
        updateRepoState();
      }

      // Show hints if enabled
      if (showHints && result.success) {
        const hints = getContextualHints(command);
        if (hints.length > 0) {
          setTimeout(() => {
            addTerminalLine({ type: "info", text: `💡 Hint: ${hints[0]}` });
          }, 500);
        }
      }
    },
    [addTerminalLine, updateRepoState, showHints]
  );

  const getContextualHints = (command: string): string[] => {
    const hints: string[] = [];

    if (command.includes("git status")) {
      hints.push("Try 'git add .' to stage all changes");
    } else if (command.includes("git add")) {
      hints.push("Use 'git commit -m \"message\"' to create a commit");
    } else if (command.includes("git commit")) {
      hints.push("Try 'git log --oneline' to view commit history");
    } else if (command.includes("git branch")) {
      hints.push("Use 'git checkout <branch>' to switch branches");
    } else if (command.includes("git checkout")) {
      hints.push("Try 'git merge <branch>' to merge branches");
    }

    return hints;
  };

  const handleFileSave = (path: string, content: string) => {
    repoEnvironment.setFile(path, content);
    updateRepoState();
    addTerminalLine({ type: "success", text: `File ${path} saved` });
  };

  const handleCreateFile = (path: string) => {
    repoEnvironment.setFile(path, "", "untracked");
    updateRepoState();
    addTerminalLine({ type: "success", text: `Created file: ${path}` });
    setCurrentFile(path);
  };

  const handleReset = () => {
    if (confirm("Reset sandbox? This will clear all changes.")) {
      repoEnvironment.reset();
      clearTerminal();
      updateRepoState();
      addTerminalLine({ type: "output", text: "Sandbox reset" });
    }
  };

  const handleLoadSample = (sample: any) => {
    repoEnvironment.loadSample(sample);
    clearTerminal();
    updateRepoState();
    addTerminalLine({ type: "success", text: `Loaded sample: ${sample.name}` });
    setShowIntro(false);
  };

  const handleStartFresh = () => {
    repoEnvironment.init();
    clearTerminal();
    addTerminalLine({
      type: "success",
      text: "Initialized empty Git repository",
    });
    addTerminalLine({
      type: "output",
      text: "You can now start adding files and making commits!",
    });
    addTerminalLine({ type: "output", text: "" });
    updateRepoState();
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <AppShell
        appBarProps={{ title: "Sandbox Mode", showCommandReference: false }}
      >
        <motion.div
          className="flex items-center justify-center min-h-screen p-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="max-w-2xl w-full">
            <PanelHeader>
              <Heading level={2}>Sandbox Mode</Heading>
            </PanelHeader>
            <PanelContent className="space-y-6">
              <Text>
                Here you can experiment freely with Git commands. Try anything.
                Break things. Practice.
              </Text>

              <div className="space-y-4">
                <Button
                  onClick={handleStartFresh}
                  className="w-full github-btn"
                  size="lg"
                >
                  Start Fresh Repository
                </Button>

                <div className="space-y-2">
                  <Text size="sm" weight="semibold">
                    Load Sample Repository:
                  </Text>
                  <Button
                    onClick={() => handleLoadSample(simpleBlog)}
                    variant="outline"
                    className="w-full"
                  >
                    {simpleBlog.name} - {simpleBlog.description}
                  </Button>
                  <Button
                    onClick={() => handleLoadSample(todoApp)}
                    variant="outline"
                    className="w-full"
                  >
                    {todoApp.name} - {todoApp.description}
                  </Button>
                </div>

                <Button onClick={onExit} variant="ghost" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </PanelContent>
          </Panel>
        </motion.div>
      </AppShell>
    );
  }

  // Get state safely
  let state;
  try {
    state = repoEnvironment.getState();
  } catch (error) {
    console.error("Error getting repo state:", error);
    state = {
      isInitialized: false,
      commits: [],
      branches: [],
      currentBranch: "main",
      files: {},
      staged: [],
      modified: [],
      untracked: [],
      HEAD: "",
    };
  }

  const currentFileData = currentFile
    ? repoEnvironment.getFile(currentFile)
    : null;

  // Safety check - if state is not initialized and not showing intro, show intro
  if (!showIntro && (!state || !state.isInitialized)) {
    return (
      <AppShell>
        <motion.div
          className="flex items-center justify-center min-h-screen p-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Panel className="max-w-2xl w-full">
            <PanelHeader>
              <Heading level={2}>Sandbox Mode</Heading>
            </PanelHeader>
            <PanelContent className="space-y-6">
              <Text>
                Here you can experiment freely with Git commands. Try anything.
                Break things. Practice.
              </Text>

              <div className="space-y-4">
                <Button
                  onClick={handleStartFresh}
                  className="w-full github-btn"
                  size="lg"
                >
                  Start Fresh Repository
                </Button>

                <div className="space-y-2">
                  <Text size="sm" weight="semibold">
                    Load Sample Repository:
                  </Text>
                  <Button
                    onClick={() => handleLoadSample(simpleBlog)}
                    variant="outline"
                    className="w-full"
                  >
                    {simpleBlog.name} - {simpleBlog.description}
                  </Button>
                  <Button
                    onClick={() => handleLoadSample(todoApp)}
                    variant="outline"
                    className="w-full"
                  >
                    {todoApp.name} - {todoApp.description}
                  </Button>
                </div>

                <Button onClick={onExit} variant="ghost" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </PanelContent>
          </Panel>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell
      appBarProps={{ title: "Sandbox Mode", showCommandReference: true }}
    >
      <motion.div
        className="h-full space-y-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Heading level={2}>Sandbox Mode</Heading>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTutorial(true)}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Tutorial
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowHints(!showHints)}
            >
              <Lightbulb
                className={`w-4 h-4 mr-1 ${showHints ? "text-warning" : ""}`}
              />
              Hints {showHints ? "ON" : "OFF"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" variant="outline" onClick={onExit}>
              <Home className="w-4 h-4 mr-1" />
              Home
            </Button>
          </div>
        </div>

        {/* 4-Panel Layout */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)]">
          {/* File Explorer */}
          <div className="col-span-2">
            <FileExplorer
              files={state?.files || {}}
              currentBranch={state?.currentBranch || "main"}
              currentFile={currentFile}
              onFileSelect={setCurrentFile}
              onCreateFile={handleCreateFile}
            />
          </div>

          {/* Code Editor */}
          <div className="col-span-5">
            <SandboxEditor
              file={currentFileData}
              filePath={currentFile}
              onSave={handleFileSave}
              onCreateFile={handleCreateFile}
            />
          </div>

          {/* Timeline Visualizer */}
          <div className="col-span-5">
            <TimelineVisualizer
              commits={state?.commits || []}
              branches={state?.branches || []}
              currentBranch={state?.currentBranch || "main"}
            />
          </div>
        </div>

        {/* Terminal */}
        <div className="h-[200px]">
          <TerminalWindow height={200}>
            <GuidedTerminal
              onCommand={handleCommand}
              suggestions={[]}
              useGlobalStore={true}
            />
          </TerminalWindow>
        </div>
      </motion.div>

      {/* Tutorial Dialog */}
      <SandboxTutorial
        open={showTutorial}
        onClose={() => {
          setShowTutorial(false);
          localStorage.setItem("sandbox-tutorial-seen", "true");
        }}
      />
    </AppShell>
  );
};
