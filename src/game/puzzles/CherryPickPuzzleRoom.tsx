import { useState } from "react";
import { CherryPickLevel, CommitNode } from "@/types/game";
import { CherryPickCommitNode } from "@/components/timeline/CherryPickCommitNode";
import { CommitNode as MainCommitNode } from "@/components/timeline/CommitNode";
import { Terminal, TerminalMessage } from "@/components/terminal/Terminal";
import { GitBranch, ArrowLeft, Cherry, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CherryPickPuzzleRoomProps {
  level: CherryPickLevel;
  onComplete: () => void;
  onBack: () => void;
}

export const CherryPickPuzzleRoom = ({ level, onComplete, onBack }: CherryPickPuzzleRoomProps) => {
  const [currentMainOrder, setCurrentMainOrder] = useState<string[]>(level.mainTimeline);
  const [featureCommitsRemaining, setFeatureCommitsRemaining] = useState<string[]>(
    level.featureTimeline.map((c) => c.id)
  );
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { type: "info", text: "> ready: cherry-pick mode enabled" },
    { type: "info", text: "> select the commit you need to apply" },
  ]);
  const [isShaking, setIsShaking] = useState(false);

  // Get commit data from feature timeline
  const getFeatureCommit = (id: string) => level.featureTimeline.find((c) => c.id === id);

  // Convert feature commit to main commit node format
  const convertToMainCommit = (id: string): CommitNode => {
    const featureCommit = getFeatureCommit(id);
    return {
      id: featureCommit?.id || id,
      sha: featureCommit?.sha || "unknown",
      message: featureCommit?.message || "Unknown commit",
      branch: "main",
    };
  };

  // Get main commit (A, B are predefined)
  const getMainCommit = (id: string): CommitNode => {
    const predefined: Record<string, CommitNode> = {
      A: { id: "A", sha: "a1b2c3d", message: "Initial commit", branch: "main" },
      B: { id: "B", sha: "e4f5g6h", message: "Add core features", branch: "main" },
    };
    return predefined[id] || convertToMainCommit(id);
  };

  const handleDragStart = (e: React.DragEvent, commitId: string) => {
    setDraggingId(commitId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("commitId", commitId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnMain = (e: React.DragEvent) => {
    e.preventDefault();
    const commitId = e.dataTransfer.getData("commitId");
    
    // Only allow dropping one commit
    if (!selectedCommit && featureCommitsRemaining.includes(commitId)) {
      setSelectedCommit(commitId);
      setCurrentMainOrder([...currentMainOrder, commitId]);
      setFeatureCommitsRemaining(featureCommitsRemaining.filter((id) => id !== commitId));
    }

    setDraggingId(null);
  };

  const handleRemoveFromMain = () => {
    if (selectedCommit) {
      setCurrentMainOrder(currentMainOrder.filter((id) => id !== selectedCommit));
      setFeatureCommitsRemaining([...featureCommitsRemaining, selectedCommit]);
      setSelectedCommit(null);
    }
  };

  const checkCherryPick = () => {
    const isCorrect =
      currentMainOrder.length === level.expectedFinal.length &&
      currentMainOrder.every((id, idx) => id === level.expectedFinal[idx]);

    // Check if wrong commit was selected
    const selectedFeatureCommit = selectedCommit ? getFeatureCommit(selectedCommit) : null;
    const wrongCommit = selectedCommit && selectedFeatureCommit && !selectedFeatureCommit.key;

    if (wrongCommit) {
      setMessages([
        ...messages,
        { type: "error", text: "> error: cherry-pick failed: incorrect commit selected" },
        { type: "info", text: "> hint: look for the commit that fixes the critical issue" },
      ]);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } else if (isCorrect && selectedCommit) {
      const commit = getFeatureCommit(selectedCommit);
      setMessages([
        ...messages,
        { type: "success", text: `> git cherry-pick ${commit?.sha}` },
        { type: "success", text: "> Successfully applied commit." },
      ]);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setMessages([
        ...messages,
        { type: "error", text: "> error: no commit selected or timeline incomplete" },
      ]);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 gap-6">
      <div className="panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="github-btn">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Cherry className="w-5 h-5 text-warning" />
            <span className="font-semibold">main vs feature/bugfix</span>
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Goal: {level.description}</h2>
        <p className="text-sm text-muted-foreground mb-2">{level.hint}</p>
        <p className="text-xs text-warning flex items-center gap-2">
          <Star className="w-3 h-3 fill-warning" />
          Key commits are marked with a star - these are the ones you need!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Timeline */}
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="font-mono font-semibold">main</h3>
              {selectedCommit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFromMain}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>

            <div
              className={`relative min-h-[80px] bg-editor rounded-md p-4 transition-all ${
                isShaking ? "animate-[shake_0.3s_ease-in-out]" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDropOnMain}
            >
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-blue-500/30"></div>

              <div className="relative flex items-center gap-3 flex-wrap">
                {currentMainOrder.map((commitId) => {
                  const commit = getMainCommit(commitId);
                  return (
                    <MainCommitNode
                      key={`main-${commitId}`}
                      commit={commit}
                      isDragging={false}
                    />
                  );
                })}

                {!selectedCommit && (
                  <div className="w-24 h-16 border-2 border-dashed border-warning/40 rounded-md flex items-center justify-center">
                    <span className="text-xs text-warning">Drop here</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feature Timeline */}
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <h3 className="font-mono font-semibold">feature/bugfix</h3>
            </div>

            <div className="relative min-h-[80px] bg-editor rounded-md p-4">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-purple-500/30"></div>

              <div className="relative flex items-center gap-3 flex-wrap">
                {featureCommitsRemaining.map((commitId) => {
                  const commit = getFeatureCommit(commitId);
                  if (!commit) return null;

                  return (
                    <CherryPickCommitNode
                      key={`feature-${commitId}`}
                      commit={commit}
                      isDragging={draggingId === commitId}
                      onDragStart={(e) => handleDragStart(e, commitId)}
                      onDragEnd={() => setDraggingId(null)}
                    />
                  );
                })}

                {featureCommitsRemaining.length === 0 && (
                  <span className="text-sm text-muted-foreground italic">
                    Commit cherry-picked
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="panel p-4 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              <strong>Tip:</strong> Cherry-pick extracts a single commit and applies it elsewhere.
              Only select the commit that solves the critical bug.
            </p>
          </div>
        </div>

        {/* Resulting History Preview */}
        <div className="panel p-6 flex flex-col">
          <h3 className="font-semibold mb-4">Resulting History</h3>

          <div className="flex-1 bg-editor rounded-md p-4 font-mono text-sm space-y-2">
            {currentMainOrder.map((commitId) => {
              const commit = getMainCommit(commitId);

              return (
                <div key={`preview-${commitId}`} className="flex items-start gap-2 text-xs">
                  <span className="text-warning">*</span>
                  <div>
                    <div className="text-terminal-text">{commit.sha}</div>
                    <div className="text-muted-foreground">{commit.message}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={checkCherryPick}
            disabled={!selectedCommit}
            className="w-full mt-4 bg-success hover:bg-success/90 text-white"
          >
            Apply Cherry-Pick
          </Button>
        </div>
      </div>

      <div className="panel p-4">
        <Terminal messages={messages} />
      </div>
    </div>
  );
};
