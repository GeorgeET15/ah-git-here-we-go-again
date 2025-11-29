/**
 * Step Renderer for Editor Task Steps
 */

import React, { useState, useEffect, useMemo } from "react";
import { useLessonEngine } from "../LessonContext";
import { EditorStep } from "../types";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Text } from "@/ui/components/Typography";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/game/state/selectors";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

interface StepEditorTaskProps {
  step: EditorStep;
}

export const StepEditorTask: React.FC<StepEditorTaskProps> = ({ step }) => {
  const { nextStep } = useLessonEngine();
  const [content, setContent] = useState(step.initialContent || "");
  const [selectedResolution, setSelectedResolution] = useState<"head" | "feature" | "both" | null>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { addTerminalLine } = useGameStore();

  // Parse conflict markers if present
  const hasConflict = content.includes("<<<<<<< HEAD");
  
  // Detect language from file extension
  const languageExtension = useMemo(() => {
    const ext = step.file?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'py':
        return python();
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return javascript({ jsx: ext === 'jsx' || ext === 'tsx' });
      default:
        return null;
    }
  }, [step.file]);
  
  // Check if code is fixed
  const checkIfFixed = () => {
    if (step.expectedFix) {
      let fixed = false;
      
      // Check for common fixes based on expected fix type
      if (step.expectedFix.includes("addition") || step.expectedFix.includes("calculation")) {
        // Check if subtraction was changed to addition
        fixed = content.includes("a + b") || content.includes("result = a + b");
      } else if (step.expectedFix.includes("null pointer")) {
        // Check if NULL pointer dereference is fixed
        fixed = !content.includes("*ptr = 42") || content.includes("ptr != NULL") || content.includes("ptr = malloc");
      } else {
        // Generic check: code has changed from initial
        fixed = content !== step.initialContent && content.length > 0;
      }
      
      if (fixed && !isFixed) {
        setIsFixed(true);
        addTerminalLine({ type: "success", text: "✓ Code fixed! The function now works correctly." });
        addTerminalLine({ type: "info", text: "Click 'Save' to save the file, then stage and commit your changes." });
      }
      return fixed;
    }
    return false;
  };

  // Check on content change
  React.useEffect(() => {
    if (content !== step.initialContent) {
      checkIfFixed();
    }
  }, [content]);

  const getResolvedCode = () => {
    if (!hasConflict) return content;
    
    if (selectedResolution === "head") {
      return content.split("<<<<<<< HEAD")[0] + 
             content.split("<<<<<<< HEAD")[1].split("=======")[0] + 
             content.split(">>>>>>>")[1].split("\n").slice(1).join("\n");
    } else if (selectedResolution === "feature") {
      return content.split("<<<<<<< HEAD")[0] + 
             content.split("=======")[1].split(">>>>>>>")[0] + 
             content.split(">>>>>>>")[1].split("\n").slice(1).join("\n");
    } else if (selectedResolution === "both") {
      return content.split("<<<<<<< HEAD")[0] + 
             content.split("<<<<<<< HEAD")[1].split("=======")[0] + 
             content.split("=======")[1].split(">>>>>>>")[0] + 
             content.split(">>>>>>>")[1].split("\n").slice(1).join("\n");
    }
    return content;
  };

  const handleApplyResolution = () => {
    if (selectedResolution) {
      setContent(getResolvedCode());
      addTerminalLine({ type: "success", text: "Conflict resolved! File is clean and ready to commit." });
      nextStep();
    }
  };

  const handleSave = () => {
    if (isFixed) {
      setIsSaved(true);
      addTerminalLine({ type: "success", text: `✓ File saved: ${step.file}` });
      addTerminalLine({ type: "info", text: "Next: Stage your changes with 'git add .' then commit with 'git commit -m \"Fix calculation\"'" });
      // Auto-advance to terminal step after saving
      setTimeout(() => {
        nextStep();
      }, 1500);
    }
  };

  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center justify-between">
          <Text size="sm" variant="muted" className="font-mono">{step.file}</Text>
          {hasConflict && !selectedResolution && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedResolution("head")}
                className="text-xs"
              >
                Keep HEAD Version
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedResolution("feature")}
                className="text-xs"
              >
                Keep Feature Version
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedResolution("both")}
                className="text-xs"
              >
                Keep Both
              </Button>
            </div>
          )}
        </div>
      </PanelHeader>
      <PanelContent padding="none" className="flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto">
          <CodeMirror
            value={content}
            height="300px"
            onChange={(value) => setContent(value)}
            extensions={languageExtension ? [languageExtension] : []}
            theme={oneDark}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
            }}
            editable={!step.readonly}
            placeholder={step.hint || "Fix the code..."}
          />
        </div>
        {step.hint && !isFixed && (
          <div className="p-4 bg-primary/10 border-t border-border">
            <Text size="sm" className="text-primary">
              💡 Hint: {step.hint}
            </Text>
          </div>
        )}
        {isFixed && !isSaved && (
          <div className="p-4 bg-success/10 border-t border-border space-y-2">
            <Text size="sm" className="text-success font-semibold">
              ✓ Code fixed! The function now works correctly.
            </Text>
            <Text size="xs" className="text-foreground">
              Click "Save" to save the file before staging and committing.
            </Text>
          </div>
        )}
        {isSaved && (
          <div className="p-4 bg-success/10 border-t border-border">
            <Text size="sm" className="text-success font-semibold">
              ✓ File saved successfully!
            </Text>
          </div>
        )}
      </PanelContent>
      {selectedResolution && hasConflict && (
        <div className="p-4 border-t border-border flex justify-center">
          <Button onClick={handleApplyResolution} className="github-btn px-8">
            Apply Resolution
          </Button>
        </div>
      )}
      {isFixed && !isSaved && !hasConflict && (
        <div className="p-4 border-t border-border flex justify-center">
          <Button onClick={handleSave} className="github-btn px-8">
            Save File
          </Button>
        </div>
      )}
    </Panel>
  );
};
