import { useState } from "react";
import { GuidedTerminal, TerminalLine } from "@/components/terminal/GuidedTerminal";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { ConceptPanel, ConceptExplanation } from "@/components/concept/ConceptPanel";
import { conceptExplanations } from "@/data/conceptExplanations";
import { useCommandSuggestions } from "@/hooks/useCommandSuggestions";
import { Zap } from "lucide-react";

interface RebaseLessonProps {
  onComplete: () => void;
}

type LessonStep = "checkout" | "rebase" | "applying" | "complete";

export const RebaseLesson = ({ onComplete }: RebaseLessonProps) => {
  const [step, setStep] = useState<LessonStep>("checkout");
  const [rebaseProgress, setRebaseProgress] = useState(0);
  const [showConcept, setShowConcept] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptExplanation | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: "output", text: "Let's rebase the feature branch onto main for a clean history." },
    { type: "output", text: "" },
  ]);

  const lessonStateMap: Record<LessonStep, string> = {
    checkout: "act4-checkout",
    rebase: "act4-rebase",
    applying: "act4-rebase",
    complete: "act4-complete",
  };

  const suggestions = useCommandSuggestions(lessonStateMap[step]);

  const handleCommand = (command: string) => {
    const cmd = command.trim();
    
    setTerminalLines((prev) => [
      ...prev,
      { type: "command", text: cmd },
    ]);

    if (step === "checkout" && cmd === "git checkout feature/login") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "success", text: "Switched to branch 'feature/login'" },
        { type: "output", text: "" },
      ]);
      setStep("rebase");
    } else if (step === "rebase" && cmd === "git rebase main") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "output", text: "First, rewinding head to replay your work on top of it..." },
        { type: "output", text: "" },
      ]);
      setStep("applying");
      
      // Simulate commit replay
      setTimeout(() => {
        setRebaseProgress(1);
        setTerminalLines((prev) => [
          ...prev,
          { type: "output", text: "Applying: Add login feature (C)" },
          { type: "success", text: "✓ Commit C replayed" },
          { type: "output", text: "" },
        ]);
      }, 1000);

      setTimeout(() => {
        setRebaseProgress(2);
        setTerminalLines((prev) => [
          ...prev,
          { type: "output", text: "Applying: Add authentication (D)" },
          { type: "success", text: "✓ Commit D replayed" },
          { type: "output", text: "" },
          { type: "success", text: "Successfully rebased and updated refs/heads/feature/login" },
          { type: "success", text: "" },
          { type: "success", text: "💡 Concept: Rebase replays commits to create a linear history." },
          { type: "output", text: "   The commits get new IDs but the changes are the same." },
          { type: "output", text: "   Never rebase public branches - it rewrites history!" },
          { type: "output", text: "" },
          { type: "success", text: "🎉 Rebase completed! History is now linear." },
          { type: "output", text: "" },
        ]);
        setCurrentConcept(conceptExplanations["git rebase"]);
        setShowConcept(true);
      }, 2500);
    } else {
      setTerminalLines((prev) => [
        ...prev,
        { type: "error", text: `Command not recognized or not expected at this step.` },
        { type: "output", text: "Check the suggestions above." },
        { type: "output", text: "" },
      ]);
    }
  };

  const handleConceptContinue = () => {
    setShowConcept(false);
    if (step === "complete") {
      setTimeout(() => {
        onComplete();
      }, 1000);
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Rebase: Rewrite History</h2>
          </div>
          <p className="text-muted-foreground">
            Replay commits on top of another branch for a clean, linear timeline
          </p>
        </div>

        {/* Timeline Panels */}
        <div className="grid grid-cols-2 gap-6">
          {/* Before Rebase */}
          <Panel>
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
              Before Rebase
            </h3>
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
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              After Rebase
            </h3>
            <svg width="100%" height="180">
              {step === "checkout" ? (
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

        {/* Terminal */}
        <TerminalWindow height={350}>
          <GuidedTerminal
            suggestions={suggestions}
            onCommand={handleCommand}
            lines={terminalLines}
          />
        </TerminalWindow>
      </div>
    </div>
  );
};
