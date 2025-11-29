import { useState, useEffect } from "react";
import { RebaseLevel } from "@/types/game";
import { CommitNode } from "@/components/timeline/CommitNode";
import { Terminal, TerminalMessage } from "@/components/terminal/Terminal";
import { GitBranch, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RebasePuzzleRoomProps {
  level: RebaseLevel;
  onComplete: () => void;
  onBack: () => void;
}

export const RebasePuzzleRoom = ({ level, onComplete, onBack }: RebasePuzzleRoomProps) => {
  const [currentMainOrder, setCurrentMainOrder] = useState<string[]>(level.mainTimeline);
  const [featureCommitsRemaining, setFeatureCommitsRemaining] = useState<string[]>(level.featureTimeline);
  const [trashedCommits, setTrashedCommits] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { type: "info", text: "> ready: rebase simulation started" },
    { type: "info", text: "> drag commits to new positions" },
  ]);
  const [isShaking, setIsShaking] = useState(false);

  const getCommitById = (id: string) => level.commits.find((c) => c.id === id);

  const handleDragStart = (e: React.DragEvent, commitId: string, source: "main" | "feature" | "trash") => {
    setDraggingId(commitId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("commitId", commitId);
    e.dataTransfer.setData("source", source);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnMain = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const commitId = e.dataTransfer.getData("commitId");
    const source = e.dataTransfer.getData("source");

    if (source === "feature") {
      const newMain = [...currentMainOrder];
      newMain.splice(dropIndex, 0, commitId);
      setCurrentMainOrder(newMain);
      setFeatureCommitsRemaining(featureCommitsRemaining.filter((id) => id !== commitId));
    } else if (source === "main") {
      const oldIndex = currentMainOrder.indexOf(commitId);
      const newMain = [...currentMainOrder];
      newMain.splice(oldIndex, 1);
      newMain.splice(dropIndex, 0, commitId);
      setCurrentMainOrder(newMain);
    } else if (source === "trash") {
      const newMain = [...currentMainOrder];
      newMain.splice(dropIndex, 0, commitId);
      setCurrentMainOrder(newMain);
      setTrashedCommits(trashedCommits.filter((id) => id !== commitId));
    }

    setDraggingId(null);
  };

  const handleDropOnTrash = (e: React.DragEvent) => {
    e.preventDefault();
    const commitId = e.dataTransfer.getData("commitId");
    const source = e.dataTransfer.getData("source");

    if (source === "main") {
      setCurrentMainOrder(currentMainOrder.filter((id) => id !== commitId));
      setTrashedCommits([...trashedCommits, commitId]);
    } else if (source === "feature") {
      setFeatureCommitsRemaining(featureCommitsRemaining.filter((id) => id !== commitId));
      setTrashedCommits([...trashedCommits, commitId]);
    }

    setDraggingId(null);
  };

  const checkRebase = () => {
    const isCorrect =
      currentMainOrder.length === level.correctTimeline.length &&
      currentMainOrder.every((id, idx) => id === level.correctTimeline[idx]);

    if (isCorrect) {
      setMessages([
        ...messages,
        { type: "success", text: "> git rebase feature/refactor" },
        { type: "success", text: "> Successfully rebased and updated refs/heads/main." },
      ]);
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setMessages([
        ...messages,
        { type: "error", text: "> error: history does not match target sequence" },
        { type: "info", text: "> hint: try reordering or dropping wrong commits" },
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
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="github-btn"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <GitBranch className="w-5 h-5 text-primary" />
            <span className="font-semibold">main vs feature/refactor</span>
          </div>
        </div>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Goal: {level.description}</h2>
        <p className="text-sm text-muted-foreground mb-4">{level.hint}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Timeline */}
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="font-mono font-semibold">main</h3>
            </div>
            
            <div
              className={`relative min-h-[80px] bg-editor rounded-md p-4 transition-all ${
                isShaking ? "animate-[shake_0.3s_ease-in-out]" : ""
              }`}
              onDragOver={handleDragOver}
            >
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-blue-500/30"></div>
              
              <div className="relative flex items-center gap-3 flex-wrap">
                {currentMainOrder.map((commitId, idx) => {
                  const commit = getCommitById(commitId);
                  if (!commit) return null;
                  
                  return (
                    <div
                      key={`main-${commitId}-${idx}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnMain(e, idx)}
                      className="relative"
                    >
                      <CommitNode
                        commit={commit}
                        isDragging={draggingId === commitId}
                        onDragStart={(e) => handleDragStart(e, commitId, "main")}
                        onDragEnd={() => setDraggingId(null)}
                      />
                    </div>
                  );
                })}
                
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnMain(e, currentMainOrder.length)}
                  className="w-16 h-16 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center"
                >
                  <span className="text-xs text-muted-foreground">+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Timeline */}
          <div className="panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <h3 className="font-mono font-semibold">feature/refactor</h3>
            </div>
            
            <div className="relative min-h-[80px] bg-editor rounded-md p-4">
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-purple-500/30"></div>
              
              <div className="relative flex items-center gap-3 flex-wrap">
                {featureCommitsRemaining.map((commitId) => {
                  const commit = getCommitById(commitId);
                  if (!commit) return null;
                  
                  return (
                    <CommitNode
                      key={`feature-${commitId}`}
                      commit={commit}
                      isDragging={draggingId === commitId}
                      onDragStart={(e) => handleDragStart(e, commitId, "feature")}
                      onDragEnd={() => setDraggingId(null)}
                    />
                  );
                })}
                
                {featureCommitsRemaining.length === 0 && (
                  <span className="text-sm text-muted-foreground italic">All commits moved</span>
                )}
              </div>
            </div>
          </div>

          {/* Trash Area */}
          <div
            className="panel p-6 bg-destructive/5 border-destructive/20"
            onDragOver={handleDragOver}
            onDrop={handleDropOnTrash}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-4 h-4 text-destructive" />
              <h3 className="font-mono font-semibold text-destructive">Discard Area</h3>
            </div>
            
            <div className="min-h-[60px] bg-editor/50 rounded-md p-4 flex items-center gap-3 flex-wrap">
              {trashedCommits.map((commitId) => {
                const commit = getCommitById(commitId);
                if (!commit) return null;
                
                return (
                  <CommitNode
                    key={`trash-${commitId}`}
                    commit={commit}
                    isDragging={draggingId === commitId}
                    isInTrash
                    onDragStart={(e) => handleDragStart(e, commitId, "trash")}
                    onDragEnd={() => setDraggingId(null)}
                  />
                );
              })}
              
              {trashedCommits.length === 0 && (
                <span className="text-sm text-muted-foreground italic">Drop unwanted commits here</span>
              )}
            </div>
          </div>
        </div>

        {/* Final History Preview */}
        <div className="panel p-6 flex flex-col">
          <h3 className="font-semibold mb-4">Final History Preview</h3>
          
          <div className="flex-1 bg-editor rounded-md p-4 font-mono text-sm space-y-2">
            {currentMainOrder.map((commitId, idx) => {
              const commit = getCommitById(commitId);
              if (!commit) return null;
              
              return (
                <div key={`preview-${commitId}-${idx}`} className="flex items-start gap-2 text-xs">
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
            onClick={checkRebase}
            disabled={currentMainOrder.length === 0}
            className="w-full mt-4 bg-success hover:bg-success/90 text-white"
          >
            Apply Rebase
          </Button>
        </div>
      </div>

      <div className="panel p-4">
        <Terminal messages={messages} />
      </div>
    </div>
  );
};
