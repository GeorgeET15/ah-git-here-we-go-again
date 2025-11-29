/**
 * Act 5 Lesson - Using LessonEngine
 */

import React, { useState } from "react";
import { LessonEngineProvider, LessonStepRenderer, useLessonEngine } from "@/game/lessonEngine";
import { AppShell } from "@/ui/layout";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { Panel } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { AlertCircle, CheckCircle, GitCommit, Ghost } from "lucide-react";
import { useGameStore } from "@/game/state/selectors";
import { SuccessBanner } from "@/ui/components/Feedback";

interface Act5LessonEngineProps {
  onComplete: () => void;
}

interface Commit {
  sha: string;
  message: string;
  isMissing?: boolean;
}

const Act5LessonContent: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentStep, state } = useLessonEngine();
  const { terminalLines } = useGameStore();
  const [cherryPickSuccess, setCherryPickSuccess] = useState(false);

  // Update state based on terminal output
  React.useEffect(() => {
    if (terminalLines.some(l => l.text.includes("Cherry-pick successful"))) {
      setCherryPickSuccess(true);
    }
  }, [terminalLines]);

  // Show UI during terminal and concept steps
  const showUI = currentStep?.type === "terminal" || currentStep?.type === "concept";

  // Get commits from lesson visualization data (fallback to defaults)
  const lessonData = state.lesson as any;
  const commits: Commit[] = lessonData?.visualizations?.commits || [
    { sha: "a1b2c3f", message: "Add login feature" },
    { sha: "f91d022", message: "Fix startup crash", isMissing: true },
    { sha: "c31ac44", message: "Initial commit" },
  ];

  const brokenCode = lessonData?.visualizations?.editor?.brokenContent || 
    `def startup():
    # CRITICAL BUG: Missing null check
    user = get_user()  # <-- This crashes if user is None
    print(f"Welcome {user.name}")  # <-- Error here!

startup()`;

  const fixedCode = lessonData?.visualizations?.editor?.fixedContent ||
    `def startup():
    user = get_user()
    if user is None:  # <-- FIX: Added null check
        print("Welcome Guest")
        return
    print(f"Welcome {user.name}")

startup()`;

  const commitFound = terminalLines.some(l => l.text.includes("git log --oneline"));

  return (
    <>
      <GitReferencePanel />
      
      {showUI && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Heading level={2} className="mb-2">Cherry-Pick Rescue Mission</Heading>
            <Text variant="muted">
              Locate the missing commit and restore it to save production
            </Text>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Broken Code Panel */}
            <Panel className="flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-error" />
                <Text size="sm" variant="error" className="font-mono">app.py (BROKEN)</Text>
              </div>
              <div className="flex-1 bg-[hsl(var(--editor-bg))] border border-error/30 rounded p-4 font-mono text-xs overflow-auto">
                <pre className="text-foreground whitespace-pre-wrap">
                  {cherryPickSuccess ? (
                    <span className="text-success">{fixedCode}</span>
                  ) : (
                    <span className="text-error">{brokenCode}</span>
                  )}
                </pre>
              </div>
              {cherryPickSuccess && (
                <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded animate-fade-in">
                  <p className="text-success text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Code fixed! Production restored.
                  </p>
                </div>
              )}
            </Panel>

            {/* Center: Commit Timeline Visualizer */}
            <Panel className="flex flex-col">
              <div className="mb-4 flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-primary" />
                <Text size="sm" weight="semibold">Commit History</Text>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-3 relative">
                {commits.map((commit, idx) => (
                  <div
                    key={commit.sha}
                    className={`p-3 rounded border-2 transition-all relative ${
                      commit.isMissing && !cherryPickSuccess
                        ? "border-error/50 bg-error/10 animate-pulse"
                        : cherryPickSuccess && commit.isMissing
                        ? "border-success/50 bg-success/10 animate-fade-in"
                        : "border-border bg-card"
                    }`}
                  >
                    {commit.isMissing && !cherryPickSuccess && (
                      <div className="absolute -top-2 -right-2 animate-bounce">
                        <Ghost className="w-6 h-6 text-error opacity-80" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {commit.isMissing && !cherryPickSuccess && (
                        <Ghost className="w-4 h-4 text-error animate-pulse" />
                      )}
                      {cherryPickSuccess && commit.isMissing && (
                        <CheckCircle className="w-4 h-4 text-success animate-scale-in" />
                      )}
                      <Text size="xs" className="font-mono font-semibold">{commit.sha}</Text>
                      <Text size="xs" variant="muted" className="flex-1">{commit.message}</Text>
                      {commit.isMissing && !cherryPickSuccess && (
                        <Text size="xs" variant="error" weight="semibold">MISSING</Text>
                      )}
                    </div>
                  </div>
                ))}
                {cherryPickSuccess && (
                  <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded animate-fade-in">
                    <Text size="xs" variant="success" className="text-center flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Commit restored to main timeline
                    </Text>
                  </div>
                )}
              </div>
            </Panel>

            {/* Right: Terminal placeholder - will be rendered by LessonStepRenderer */}
            <Panel className="flex flex-col">
              <div className="mb-4">
                <Text size="sm" variant="muted" className="mb-2">
                  Hint: Use <code className="text-primary">git log</code> to find the missing commit.
                </Text>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* Lesson Step Renderer */}
      <LessonStepRenderer onComplete={onComplete} />
    </>
  );
};

export const Act5LessonEngine: React.FC<Act5LessonEngineProps> = ({ onComplete }) => {
  return (
    <LessonEngineProvider actId={5}>
      <AppShell>
        <Act5LessonContent onComplete={onComplete} />
      </AppShell>
    </LessonEngineProvider>
  );
};

