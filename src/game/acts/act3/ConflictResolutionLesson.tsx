import { useState } from "react";
import { GuidedTerminal, TerminalLine } from "@/components/terminal/GuidedTerminal";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { ConceptPanel, ConceptExplanation } from "@/components/concept/ConceptPanel";
import { conceptExplanations } from "@/data/conceptExplanations";
import { useCommandSuggestions } from "@/hooks/useCommandSuggestions";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ConflictResolutionLessonProps {
  onComplete: () => void;
}

type Resolution = "head" | "feature" | "both" | null;
type LessonStep = "merge" | "in-conflict" | "resolved" | "complete";

export const ConflictResolutionLesson = ({ onComplete }: ConflictResolutionLessonProps) => {
  const [step, setStep] = useState<LessonStep>("merge");
  const [selectedResolution, setSelectedResolution] = useState<Resolution>(null);
  const [showConcept, setShowConcept] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptExplanation | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: "output", text: "You're on main branch. Let's merge the feature branch." },
    { type: "output", text: "" },
  ]);

  const lessonStateMap: Record<LessonStep, string> = {
    merge: "act3-merge",
    "in-conflict": "act3-resolve",
    resolved: "act3-resolve",
    complete: "act3-complete",
  };

  const suggestions = useCommandSuggestions(lessonStateMap[step]);

  const conflictCode = `def greet():
<<<<<<< HEAD
    print("Hello from main branch")
=======
    print("Hello from feature branch")
>>>>>>> feature/login`;

  const getResolvedCode = () => {
    if (selectedResolution === "head") {
      return `def greet():
    print("Hello from main branch")`;
    } else if (selectedResolution === "feature") {
      return `def greet():
    print("Hello from feature branch")`;
    } else if (selectedResolution === "both") {
      return `def greet():
    print("Hello from main branch")
    print("Hello from feature branch")`;
    }
    return conflictCode;
  };

  const handleCommand = (command: string) => {
    const cmd = command.trim();
    
    setTerminalLines((prev) => [
      ...prev,
      { type: "command", text: cmd },
    ]);

    if (step === "merge" && cmd === "git merge feature/login") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "output", text: "Auto-merging main.py" },
        { type: "error", text: "CONFLICT (content): Merge conflict in main.py" },
        { type: "error", text: "Automatic merge failed; fix conflicts and then commit the result." },
        { type: "output", text: "" },
        { type: "output", text: "💡 Concept: A conflict happens when two branches change the same lines." },
        { type: "output", text: "   Git can't decide which version to keep - it needs human judgment." },
        { type: "output", text: "   This is normal in team development!" },
        { type: "output", text: "" },
      ]);
      setCurrentConcept(conceptExplanations["merge-conflict"]);
      setShowConcept(true);
    } else if (step === "resolved" && cmd === "git add main.py") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "Conflict resolved, file staged" },
        { type: "output", text: "" },
      ]);
    } else if (step === "resolved" && cmd === "git commit") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "[main c4d5e6f] Merge branch 'feature/login'" },
        { type: "output", text: "" },
        { type: "success", text: "🎉 Conflict resolved and merge completed!" },
        { type: "output", text: "" },
      ]);
      setStep("complete");
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: `Command not recognized or not expected at this step.` },
        { type: "output", text: "Follow the suggested commands above." },
        { type: "output", text: "" },
      ]);
    }
  };

  const handleApplyResolution = () => {
    if (!selectedResolution) return;
    setStep("resolved");
    setTerminalLines((prev) => [
      ...prev,
      { type: "success", text: "✓ Conflict markers removed from file" },
      { type: "output", text: "Now stage and commit the resolved file." },
      { type: "output", text: "" },
    ]);
  };

  const handleConceptContinue = () => {
    setShowConcept(false);
    if (step === "merge") {
      setStep("in-conflict");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <GitReferencePanel />
      <ConceptPanel 
        concept={currentConcept!} 
        onContinue={handleConceptContinue}
        show={showConcept && currentConcept !== null}
      />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Resolving Merge Conflicts</h2>
          <p className="text-muted-foreground">
            Learn how to handle conflicts when branches modify the same lines
          </p>
        </div>

        {step === "resolved" && (
          <SuccessBanner>
            <Check className="w-4 h-4" />
            Conflict resolved! File is clean and ready to commit.
          </SuccessBanner>
        )}

        {/* Code Editor Panel */}
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-sm text-muted-foreground">main.py</span>
            {step === "in-conflict" && !selectedResolution && (
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

          <div className="terminal-panel p-4 font-mono text-sm min-h-[200px]">
            {selectedResolution ? (
              <pre className="text-foreground whitespace-pre-wrap">{getResolvedCode()}</pre>
            ) : step === "merge" ? (
              <pre className="text-foreground">
                {`def greet():
    print("Hello from main branch")`}
              </pre>
            ) : (
              <pre className="text-foreground whitespace-pre-wrap">
                {conflictCode.split('\n').map((line, idx) => {
                  let colorClass = "text-foreground";
                  if (line.includes("<<<<<<< HEAD")) colorClass = "text-error";
                  else if (line.includes("=======")) colorClass = "text-muted-foreground";
                  else if (line.includes(">>>>>>> feature/login")) colorClass = "text-secondary";
                  
                  return (
                    <div key={idx} className={colorClass}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            )}
          </div>

          {selectedResolution && step === "in-conflict" && (
            <div className="mt-4 flex justify-center animate-fade-in">
              <Button onClick={handleApplyResolution} className="github-btn px-8">
                Apply Resolution
              </Button>
            </div>
          )}
        </Panel>

        {/* Terminal */}
        <div className="panel h-[300px] flex flex-col overflow-hidden">
          <GuidedTerminal
            suggestions={suggestions}
            onCommand={handleCommand}
            lines={terminalLines}
          />
        </div>
      </div>
    </div>
  );
};
