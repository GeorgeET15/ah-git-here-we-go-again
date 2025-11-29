import { useState } from "react";
import { GuidedTerminal, TerminalLine } from "@/components/terminal/GuidedTerminal";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { ConceptPanel, ConceptExplanation } from "@/components/concept/ConceptPanel";
import { conceptExplanations } from "@/data/conceptExplanations";
import { useCommandSuggestions } from "@/hooks/useCommandSuggestions";
import { Panel } from "@/ui/components/Panel";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { Heading, Text, Code } from "@/ui/components/Typography";
import { InfoBanner } from "@/ui/components/Feedback";

interface BranchingLessonProps {
  onComplete: () => void;
}

type LessonStep = "create-branch" | "checkout" | "commit" | "checkout-main" | "merge" | "complete";

export const BranchingLesson = ({ onComplete }: BranchingLessonProps) => {
  const [step, setStep] = useState<LessonStep>("create-branch");
  const [currentBranch, setCurrentBranch] = useState("main");
  const [showConcept, setShowConcept] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptExplanation | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: "output", text: "You're on the main branch. Let's create a feature branch." },
    { type: "output", text: "" },
  ]);

  const lessonStateMap: Record<LessonStep, string> = {
    "create-branch": "act2-create-branch",
    "checkout": "act2-checkout",
    "commit": "act2-commit-feature",
    "checkout-main": "act2-checkout-main",
    "merge": "act2-merge",
    "complete": "act2-complete",
  };

  const suggestions = useCommandSuggestions(lessonStateMap[step]);

  const handleCommand = (command: string) => {
    const cmd = command.trim();
    
    setTerminalLines((prev) => [
      ...prev,
      { type: "command", text: cmd },
    ]);

    if (step === "create-branch" && cmd === "git branch feature-login") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "Created branch 'feature-login'" },
        { type: "output", text: "" },
        { type: "success", text: "💡 Concept: A branch creates a parallel line of development." },
        { type: "output", text: "   Like duplicating a save file before trying something risky." },
        { type: "output", text: "   The main branch stays stable while you experiment." },
        { type: "output", text: "" },
      ]);
      setCurrentConcept(conceptExplanations["git branch"]);
      setShowConcept(true);
    } else if (step === "checkout" && cmd === "git checkout feature-login") {
      setCurrentBranch("feature-login");
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "Switched to branch 'feature-login'" },
        { type: "output", text: "" },
        { type: "success", text: "💡 Concept: Checkout switches your working directory to a different branch." },
        { type: "output", text: "   Like switching between different save files." },
        { type: "output", text: "   Your files update to match that branch's state." },
        { type: "output", text: "" },
      ]);
      setCurrentConcept(conceptExplanations["git checkout"]);
      setShowConcept(true);
    } else if (step === "commit" && cmd === "git add main.py") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "Changes staged" },
        { type: "output", text: "" },
      ]);
    } else if (step === "commit" && cmd.startsWith("git commit")) {
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "[feature-login b2c3d4e] Add login feature" },
        { type: "output", text: " 1 file changed, 5 insertions(+)" },
        { type: "output", text: "" },
      ]);
      setStep("checkout-main");
    } else if (step === "checkout-main" && cmd === "git checkout main") {
      setCurrentBranch("main");
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "Switched to branch 'main'" },
        { type: "output", text: "" },
      ]);
      setStep("merge");
    } else if (step === "merge" && cmd === "git merge feature-login") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "output", text: "Updating a1b2c3d..b2c3d4e" },
        { type: "success", text: "Fast-forward" },
        { type: "output", text: " main.py | 5 +++++" },
        { type: "output", text: " 1 file changed, 5 insertions(+)" },
        { type: "success", text: "" },
        { type: "success", text: "💡 Concept: Merge combines changes from one branch into another." },
        { type: "output", text: "   Like merging two rivers - the waters combine into one." },
        { type: "output", text: "   This is how team work comes together." },
        { type: "output", text: "" },
        { type: "success", text: "🎉 Branch merged successfully!" },
        { type: "output", text: "" },
      ]);
      setCurrentConcept(conceptExplanations["git merge"]);
      setShowConcept(true);
    } else {
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: `Command not recognized or not expected at this step.` },
        { type: "output", text: "Check the suggestions above for guidance." },
        { type: "output", text: "" },
      ]);
    }
  };

  const handleConceptContinue = () => {
    setShowConcept(false);
    if (step === "create-branch") {
      setStep("checkout");
    } else if (step === "checkout") {
      setStep("commit");
    } else if (step === "merge") {
      setStep("complete");
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

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
          <Heading level={2} className="mb-2">Branching & Merging</Heading>
          <Text variant="muted">
            Create a feature branch, make changes, and merge back to main
          </Text>
        </div>

        {/* Current Branch Indicator */}
        <InfoBanner>
          <div className="flex items-center gap-2">
            <Text size="sm" variant="muted">Current branch:</Text>
            <Code>{currentBranch}</Code>
          </div>
        </InfoBanner>

        {/* Timeline Visualization */}
        <Panel padding="lg" className="h-[300px] flex items-center justify-center">
          <svg width="100%" height="200">
            {/* Main branch baseline */}
            <line x1="50" y1="60" x2="500" y2="60" stroke="hsl(var(--primary))" strokeWidth="3" />
            <circle cx="100" cy="60" r="12" fill="hsl(var(--primary))" />
            <text x="100" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11">A</text>

            {/* Feature branch if created */}
            {step !== "create-branch" && step !== "complete" && (
              <>
                <line x1="100" y1="60" x2="100" y2="140" stroke="hsl(var(--secondary))" strokeWidth="2" strokeDasharray="4,4" className="animate-fade-in" />
                <line x1="100" y1="140" x2="350" y2="140" stroke="hsl(var(--secondary))" strokeWidth="3" className="animate-fade-in" />
                <text x="400" y="140" fill="hsl(var(--secondary))" fontSize="12">feature-login</text>
                
                {step !== "checkout" && (
                  <circle cx="250" cy="140" r="12" fill="hsl(var(--secondary))" className="animate-scale-in" />
                )}
                {step !== "checkout" && (
                  <text x="250" y="120" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="11">B</text>
                )}
              </>
            )}

            {/* Merged state */}
            {step === "complete" && (
              <>
                <circle cx="250" cy="60" r="12" fill="hsl(var(--success))" className="animate-scale-in" />
                <text x="250" y="40" textAnchor="middle" fill="hsl(var(--success))" fontSize="11">B</text>
              </>
            )}

            <text x="50" y="85" fill="hsl(var(--muted-foreground))" fontSize="12">main</text>
          </svg>
        </Panel>

        {/* Terminal */}
        <TerminalWindow height={300}>
          <GuidedTerminal
            suggestions={suggestions}
            onCommand={handleCommand}
            lines={terminalLines}
          />
        </TerminalWindow>
      </div>
    </>
  );
};
