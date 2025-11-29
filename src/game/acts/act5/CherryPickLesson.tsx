import { useState, useEffect } from "react";
import { GuidedTerminal, TerminalLine } from "@/components/terminal/GuidedTerminal";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { ConceptPanel, ConceptExplanation } from "@/components/concept/ConceptPanel";
import { conceptExplanations } from "@/data/conceptExplanations";
import { useCommandSuggestions } from "@/hooks/useCommandSuggestions";
import { AlertCircle, CheckCircle, GitCommit, Ghost } from "lucide-react";

interface CherryPickLessonProps {
  onComplete: () => void;
}

type LessonStep = "log" | "cherry-pick" | "complete";

interface Commit {
  sha: string;
  message: string;
  isMissing?: boolean;
}

export const CherryPickLesson = ({ onComplete }: CherryPickLessonProps) => {
  const [step, setStep] = useState<LessonStep>("log");
  const [showConcept, setShowConcept] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptExplanation | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { type: "output", text: "Production is down! A critical commit was deleted." },
    { type: "output", text: "Use git log to find the missing commit ID." },
    { type: "output", text: "" },
  ]);
  const [commitFound, setCommitFound] = useState(false);
  const [cherryPickSuccess, setCherryPickSuccess] = useState(false);
  const [missingCommitSha, setMissingCommitSha] = useState("f91d022");

  const commits: Commit[] = [
    { sha: "a1b2c3f", message: "Add login feature" },
    { sha: "f91d022", message: "Fix startup crash", isMissing: true },
    { sha: "c31ac44", message: "Initial commit" },
  ];

  const brokenCode = `def startup():
    # CRITICAL BUG: Missing null check
    user = get_user()  # <-- This crashes if user is None
    print(f"Welcome {user.name}")  # <-- Error here!

startup()`;

  const fixedCode = `def startup():
    user = get_user()
    if user is None:  # <-- FIX: Added null check
        print("Welcome Guest")
        return
    print(f"Welcome {user.name}")

startup()`;

  const lessonStateMap: Record<LessonStep, string> = {
    log: "act5-log",
    "cherry-pick": "act5-cherry-pick",
    complete: "act5-complete",
  };

  const suggestions = useCommandSuggestions(lessonStateMap[step]);

  const handleCommand = (command: string) => {
    const cmd = command.trim();
    
    setTerminalLines((prev) => [
      ...prev,
      { type: "command", text: cmd },
    ]);

    if (step === "log" && cmd === "git log --oneline") {
      setTerminalLines((prev) => [
        ...prev,
        { type: "output", text: "" },
        ...commits.map((commit) => ({
          type: commit.isMissing ? ("error" as const) : ("output" as const),
          text: `${commit.sha} ${commit.message}${commit.isMissing ? " <--- THIS is the missing commit" : ""}`,
        })),
        { type: "output", text: "" },
        { type: "success", text: "💡 Concept: git log shows project history" },
        { type: "output", text: "   Definition: browse commit history" },
        { type: "output", text: "   Real world: diagnose changes, locate bugs, track work" },
        { type: "output", text: "   Metaphor: CCTV footage of your time machine" },
        { type: "output", text: "" },
      ]);
      setCurrentConcept(conceptExplanations["git log"]);
      setShowConcept(true);
      setCommitFound(true);
    } else if (step === "cherry-pick" && cmd.startsWith("git cherry-pick")) {
      const sha = cmd.split(" ")[2];
      if (sha === missingCommitSha) {
        setTerminalLines((prev) => [
          ...prev,
          { type: "output", text: "Applying f91d022..." },
          { type: "output", text: "Restoring fix from deleted branch" },
          { type: "success", text: "Cherry-pick successful — commit replayed onto main" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: Cherry-pick = Extract a single commit and apply it elsewhere" },
          { type: "output", text: "   Used to rescue important changes without merging full branches" },
          { type: "output", text: "   Great for bug fixes and hotfixes" },
          { type: "output", text: "   Be careful with conflicts" },
          { type: "output", text: "" },
          { type: "success", text: "🎉 Production restored. You saved the project." },
          { type: "output", text: "" },
        ]);
        setCurrentConcept(conceptExplanations["git cherry-pick"]);
        setShowConcept(true);
        setCherryPickSuccess(true);
        setTimeout(() => {
          setStep("complete");
          setTimeout(() => {
            onComplete();
          }, 1500);
        }, 2000);
      } else {
        setTerminalLines((prev) => [
          ...prev,
          { type: "error", text: `fatal: invalid revision '${sha || "undefined"}'` },
          { type: "info", text: "Check the commit ID carefully — use git log again." },
          { type: "output", text: "" },
        ]);
      }
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
    if (step === "log" && commitFound) {
      setStep("cherry-pick");
    } else if (step === "cherry-pick" && cherryPickSuccess) {
      // Already handled in handleCommand
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
            <AlertCircle className="w-8 h-8 text-error" />
            <h2 className="text-3xl font-bold text-foreground">Cherry-Pick Rescue Mission</h2>
          </div>
          <p className="text-muted-foreground">
            Locate the missing commit and restore it to save production
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Broken Code Panel */}
          <Panel className="flex flex-col">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-error" />
              <span className="font-mono text-sm text-error">app.py (BROKEN)</span>
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
              <span className="text-sm font-semibold text-foreground">Commit History</span>
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
                    <span className="font-mono text-xs text-foreground font-semibold">{commit.sha}</span>
                    <span className="text-xs text-muted-foreground flex-1">{commit.message}</span>
                    {commit.isMissing && !cherryPickSuccess && (
                      <span className="text-xs text-error font-semibold">MISSING</span>
                    )}
                  </div>
                </div>
              ))}
              {cherryPickSuccess && (
                <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded animate-fade-in">
                  <p className="text-success text-xs text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Commit restored to main timeline
                  </p>
                </div>
              )}
            </div>
          </Panel>

          {/* Right: Guided Terminal */}
          <Panel className="flex flex-col">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Hint: Use <code className="text-primary">git log</code> to find the missing commit.
              </p>
            </div>
            <div className="flex-1 min-h-[400px]">
              <GuidedTerminal
                suggestions={suggestions}
                onCommand={handleCommand}
                lines={terminalLines}
              />
            </div>
          </Panel>
        </div>

        {/* Success Message */}
        {step === "complete" && (
          <SuccessBanner>
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold">
                Production restored. You saved the project.
              </div>
              <div className="text-sm text-muted-foreground">
                Keif-X: "You just used Git like a real engineer."
              </div>
            </div>
          </SuccessBanner>
        )}
      </div>
    </div>
  );
};

