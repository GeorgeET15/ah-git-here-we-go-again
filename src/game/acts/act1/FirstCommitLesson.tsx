import { useState, useEffect } from "react";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { ConceptPanel, ConceptExplanation } from "@/components/concept/ConceptPanel";
import { conceptExplanations } from "@/data/conceptExplanations";
import { useCommandSuggestions } from "@/hooks/useCommandSuggestions";
import { useGameStore } from "@/game/state/selectors";
import { TerminalLine } from "@/game/state/types";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { GitBranch } from "lucide-react";

interface FirstCommitLessonProps {
  onComplete: () => void;
}

type LessonStep = "init" | "add" | "commit" | "complete";

export const FirstCommitLesson = ({ onComplete }: FirstCommitLessonProps) => {
  const [step, setStep] = useState<LessonStep>("init");
  const [showConcept, setShowConcept] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptExplanation | null>(null);
  const { addTerminalLine, clearTerminal, setLessonStep } = useGameStore();
  const [code, setCode] = useState(`def greet():
    print("Hello, World!")

greet()`);

  // Initialize terminal on mount
  useEffect(() => {
    clearTerminal();
    addTerminalLine({ type: "output", text: "Welcome to your first Git repository!" });
    addTerminalLine({ type: "output", text: "Let's create your first commit step by step." });
    addTerminalLine({ type: "output", text: "" });
    setLessonStep("init");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lessonStateMap: Record<LessonStep, string> = {
    init: "act1-init",
    add: "act1-add",
    commit: "act1-commit",
    complete: "act1-complete",
  };

  const suggestions = useCommandSuggestions(lessonStateMap[step]);

  const handleCommand = (command: string) => {
    const cmd = command.trim();
    
    // Command is already added by GuidedTerminal when using global store

    if (step === "init" && cmd === "git init") {
      addTerminalLine({ type: "success", text: "Initialized empty Git repository in /project/.git/" });
      addTerminalLine({ type: "output", text: "" });
      addTerminalLine({ type: "success", text: "💡 Concept: A Git repository is a controlled timeline for your code." });
      addTerminalLine({ type: "output", text: "   It lets you track every change and restore or branch at any point." });
      addTerminalLine({ type: "output", text: "   Think of it like starting a new time-travel logbook for your project." });
      addTerminalLine({ type: "output", text: "" });
      setCurrentConcept(conceptExplanations["git init"]);
      setShowConcept(true);
      setLessonStep("add");
    } else if (step === "add" && cmd === "git add main.py") {
      addTerminalLine({ type: "success", text: "Changes staged for commit" });
      addTerminalLine({ type: "output", text: "" });
      addTerminalLine({ type: "success", text: "💡 Concept: The staging area lets you prepare exactly what to commit." });
      addTerminalLine({ type: "output", text: "   Like packing a box before shipping - you choose what goes in." });
      addTerminalLine({ type: "output", text: "   This gives you control over your commit history." });
      addTerminalLine({ type: "output", text: "" });
      setCurrentConcept(conceptExplanations["git add"]);
      setShowConcept(true);
      setLessonStep("commit");
    } else if (step === "commit" && cmd.startsWith("git commit")) {
      addTerminalLine({ type: "success", text: "[main (root-commit) a1b2c3d] Initial commit" });
      addTerminalLine({ type: "output", text: " 1 file changed, 4 insertions(+)" });
      addTerminalLine({ type: "output", text: " create mode 100644 main.py" });
      addTerminalLine({ type: "success", text: "" });
      addTerminalLine({ type: "success", text: "💡 Concept: A commit is a snapshot of your project at this exact moment." });
      addTerminalLine({ type: "output", text: "   Each commit has a unique ID and records who, when, and why." });
      addTerminalLine({ type: "output", text: "   You can always return to this state or see what changed." });
      addTerminalLine({ type: "output", text: "" });
      addTerminalLine({ type: "success", text: "🎉 Congratulations! You created your first commit!" });
      addTerminalLine({ type: "output", text: "" });
      setCurrentConcept(conceptExplanations["git commit"]);
      setShowConcept(true);
      setLessonStep("complete");
    } else {
      addTerminalLine({ type: "error", text: `Command not recognized or not the expected command for this step.` });
      addTerminalLine({ type: "output", text: "Hint: Follow the suggested commands above." });
      addTerminalLine({ type: "output", text: "" });
    }
  };

  const handleConceptContinue = () => {
    setShowConcept(false);
    if (step === "init") {
      setStep("add");
    } else if (step === "add") {
      setStep("commit");
    } else if (step === "commit") {
      setStep("complete");
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  // Sync step with store
  useEffect(() => {
    setLessonStep(step);
  }, [step, setLessonStep]);

  return (
    <>
      <GitReferencePanel />
      <ConceptPanel 
        concept={currentConcept!} 
        onContinue={handleConceptContinue}
        show={showConcept && currentConcept !== null}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Heading level={2} className="mb-2">Create Your First Commit</Heading>
          <Text variant="muted">
            Learn the fundamental Git workflow by typing real commands
          </Text>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6 h-[500px]">
          {/* Code Editor */}
          <Panel>
            <PanelHeader>
              <Text size="sm" variant="muted" className="font-mono">main.py</Text>
            </PanelHeader>
            <PanelContent padding="none">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-[hsl(var(--editor-bg))] border border-border rounded p-4 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                spellCheck={false}
              />
            </PanelContent>
          </Panel>

          {/* Timeline Visualization */}
          <Panel>
            <PanelHeader>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                <Text size="sm" weight="semibold">Commit Timeline</Text>
              </div>
            </PanelHeader>
            <PanelContent>
              <div className="flex-1 flex items-center justify-center">
                {step === "init" ? (
                  <div className="text-center">
                    <Text variant="muted" size="sm">No repository yet</Text>
                    <Text variant="muted" size="xs" className="mt-2">Run git init to get started</Text>
                  </div>
                ) : step === "complete" ? (
                  <svg width="100%" height="100" className="animate-fade-in">
                    <line x1="20" y1="50" x2="280" y2="50" stroke="hsl(var(--primary))" strokeWidth="3" />
                    <circle cx="150" cy="50" r="16" fill="hsl(var(--success))" className="animate-scale-in" />
                    <text x="150" y="30" textAnchor="middle" fill="hsl(var(--success))" fontSize="12">a1b2c3d</text>
                    <text x="150" y="80" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11">
                      Initial commit
                    </text>
                  </svg>
                ) : (
                  <div className="text-center">
                    <Text variant="muted" size="sm">Repository initialized</Text>
                    <Text variant="muted" size="xs" className="mt-2">Stage and commit your changes</Text>
                  </div>
                )}
              </div>
            </PanelContent>
          </Panel>
        </div>

        {/* Terminal */}
        <TerminalWindow height={300}>
          <GuidedTerminal
            suggestions={suggestions}
            onCommand={handleCommand}
            useGlobalStore={true}
          />
        </TerminalWindow>
      </div>
    </>
  );
};
