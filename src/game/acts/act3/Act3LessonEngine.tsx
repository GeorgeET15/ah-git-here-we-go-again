/**
 * Act 3 Lesson - Using LessonEngine
 */

import React from "react";
import { LessonEngineProvider, LessonStepRenderer, useLessonEngine } from "@/game/lessonEngine";
import { AppShell } from "@/ui/layout";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { Heading, Text } from "@/ui/components/Typography";
import { SuccessBanner } from "@/ui/components/Feedback";
import { Check } from "lucide-react";
import { useGameStore } from "@/game/state/selectors";

interface Act3LessonEngineProps {
  onComplete: () => void;
}

const Act3LessonContent: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentStep, state } = useLessonEngine();
  const { terminalLines } = useGameStore();

  // Show UI during terminal, concept, and editor steps
  const showUI = currentStep?.type === "terminal" || 
                 currentStep?.type === "concept" || 
                 currentStep?.type === "editor";

  const isResolved = terminalLines.some(l => l.text.includes("Conflict resolved"));

  return (
    <>
      <GitReferencePanel />
      
      {showUI && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Heading level={2} className="mb-2">Resolve Merge Conflict</Heading>
            <Text variant="muted">
              Learn how to handle conflicts when branches modify the same lines
            </Text>
          </div>

          {isResolved && (
            <SuccessBanner>
              <Check className="w-4 h-4" />
              Conflict resolved! File is clean and ready to commit.
            </SuccessBanner>
          )}
        </div>
      )}

      {/* Lesson Step Renderer */}
      <LessonStepRenderer onComplete={onComplete} />
    </>
  );
};

export const Act3LessonEngine: React.FC<Act3LessonEngineProps> = ({ onComplete }) => {
  return (
    <LessonEngineProvider actId={3}>
      <AppShell>
        <Act3LessonContent onComplete={onComplete} />
      </AppShell>
    </LessonEngineProvider>
  );
};

