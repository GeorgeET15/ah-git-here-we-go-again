/**
 * Act 4 Lesson - Using LessonEngine
 */

import React, { useState } from "react";
import { LessonEngineProvider, LessonStepRenderer, useLessonEngine } from "@/game/lessonEngine";
import { AppShell } from "@/ui/layout";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { Panel } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { useGameStore } from "@/game/state/selectors";

interface Act4LessonEngineProps {
  onComplete: () => void;
}

const Act4LessonContent: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentStep } = useLessonEngine();
  const { terminalLines } = useGameStore();
  const [rebaseProgress, setRebaseProgress] = useState(0);

  // Update rebase progress based on terminal output
  React.useEffect(() => {
    if (terminalLines.some(l => l.text.includes("Commit C replayed"))) {
      setRebaseProgress(1);
    }
    if (terminalLines.some(l => l.text.includes("Commit D replayed"))) {
      setRebaseProgress(2);
    }
  }, [terminalLines]);

  // Show UI during terminal and concept steps
  const showUI = currentStep?.type === "terminal" || currentStep?.type === "concept";

  return (
    <>
      <GitReferencePanel />
      
      {showUI && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Heading level={2} className="mb-2">Rebase: Rewrite History</Heading>
            <Text variant="muted">
              Replay commits on top of another branch for a clean, linear timeline
            </Text>
          </div>

          {/* Timeline Panels */}
          <div className="grid grid-cols-2 gap-6">
            {/* Before Rebase */}
            <Panel>
              <div className="mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                <Text size="sm" weight="semibold">Before Rebase</Text>
              </div>
              <svg width="100%" height="180">
                <line x1="20" y1="40" x2="200" y2="40" stroke="hsl(var(--primary))" strokeWidth="3" />
                <circle cx="60" cy="40" r="10" fill="hsl(var(--primary))" />
                <circle cx="140" cy="40" r="10" fill="hsl(var(--primary))" />
                <text x="60" y="25" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">A</text>
                <text x="140" y="25" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">B</text>
                <text x="20" y="65" fill="hsl(var(--muted-foreground))" fontSize="12">main</text>

                <line x1="140" y1="40" x2="140" y2="120" stroke="hsl(var(--secondary))" strokeWidth="2" strokeDasharray="4,4" />
                <line x1="140" y1="120" x2="280" y2="120" stroke="hsl(var(--secondary))" strokeWidth="3" />
                <circle cx="190" cy="120" r="10" fill="hsl(var(--secondary))" />
                <circle cx="250" cy="120" r="10" fill="hsl(var(--secondary))" />
                <text x="190" y="105" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="11">C</text>
                <text x="250" y="105" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="11">D</text>
                <text x="140" y="145" fill="hsl(var(--muted-foreground))" fontSize="12">feature</text>
              </svg>
            </Panel>

            {/* After Rebase */}
            <Panel>
              <div className="mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <Text size="sm" weight="semibold">After Rebase</Text>
              </div>
              <svg width="100%" height="180">
                {terminalLines.some(l => l.text.includes("Rebase onto Main")) ? (
                  <text x="150" y="90" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14">
                    Start rebase to see result...
                  </text>
                ) : (
                  <>
                    <line x1="20" y1="80" x2="350" y2="80" stroke="hsl(var(--primary))" strokeWidth="3" />
                    <circle cx="60" cy="80" r="10" fill="hsl(var(--primary))" />
                    <circle cx="140" cy="80" r="10" fill="hsl(var(--primary))" />
                    {rebaseProgress >= 1 && (
                      <circle cx="220" cy="80" r="10" fill="hsl(var(--success))" className="animate-scale-in" />
                    )}
                    {rebaseProgress >= 2 && (
                      <circle cx="300" cy="80" r="10" fill="hsl(var(--success))" className="animate-scale-in" />
                    )}
                    <text x="60" y="65" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">A</text>
                    <text x="140" y="65" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">B</text>
                    {rebaseProgress >= 1 && (
                      <text x="220" y="65" textAnchor="middle" fill="hsl(var(--success))" fontSize="11">C'</text>
                    )}
                    {rebaseProgress >= 2 && (
                      <text x="300" y="65" textAnchor="middle" fill="hsl(var(--success))" fontSize="11">D'</text>
                    )}
                    <text x="20" y="105" fill="hsl(var(--success))" fontSize="12">main (linear)</text>
                  </>
                )}
              </svg>
            </Panel>
          </div>
        </div>
      )}

      {/* Lesson Step Renderer */}
      <LessonStepRenderer onComplete={onComplete} />
    </>
  );
};

export const Act4LessonEngine: React.FC<Act4LessonEngineProps> = ({ onComplete }) => {
  return (
    <LessonEngineProvider actId={4}>
      <AppShell>
        <Act4LessonContent onComplete={onComplete} />
      </AppShell>
    </LessonEngineProvider>
  );
};

