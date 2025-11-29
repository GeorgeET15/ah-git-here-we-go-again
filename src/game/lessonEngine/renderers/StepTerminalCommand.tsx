/**
 * Step Renderer for Terminal Command Steps
 */

import React, { useEffect } from "react";
import { useLessonEngine } from "../LessonContext";
import { TerminalStep } from "../types";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { useGameStore } from "@/game/state/selectors";

interface StepTerminalCommandProps {
  step: TerminalStep;
}

export const StepTerminalCommand: React.FC<StepTerminalCommandProps> = ({ step }) => {
  const { handleCommand, getSuggestions, state } = useLessonEngine();
  const { addTerminalLine, clearTerminal } = useGameStore();

  // Initialize terminal output - only when step.id changes
  useEffect(() => {
    // Get initial output directly from step to avoid function dependency issues
    const terminalStep = step as any;
    const initialOutput = terminalStep.initialOutput || [];
    
    clearTerminal();
    if (initialOutput && initialOutput.length > 0) {
      initialOutput.forEach((line: any) => {
        addTerminalLine(line);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]); // Only depend on step.id to prevent infinite loops

  const onCommand = (command: string) => {
    const result = handleCommand(command);
    
    if (result.success && result.output) {
      result.output.forEach((line) => {
        addTerminalLine(line);
      });
    } else if (result.output) {
      result.output.forEach((line) => {
        addTerminalLine(line);
      });
    }
  };

  const suggestions = getSuggestions();

  return (
    <TerminalWindow height={300}>
      <GuidedTerminal
        suggestions={suggestions}
        onCommand={onCommand}
        useGlobalStore={true}
      />
    </TerminalWindow>
  );
};
