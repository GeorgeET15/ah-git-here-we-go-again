import { useState } from "react";
import { MergeLevel } from "@/types/game";
import { PuzzleTile } from "@/components/editor/PuzzleTile";
import { Terminal, TerminalMessage } from "@/components/terminal/Terminal";
import { FileCode, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PuzzleRoomProps {
  level: MergeLevel;
  onComplete: () => void;
  onBack: () => void;
}

export const PuzzleRoom = ({ level, onComplete, onBack }: PuzzleRoomProps) => {
  const [availableBlocks, setAvailableBlocks] = useState<string[]>(level.blocks);
  const [mergedOutput, setMergedOutput] = useState<string[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { type: "info", text: "> merge attempt pending..." },
  ]);

  const handleDragStart = (e: React.DragEvent, index: number, source: "available" | "merged") => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("source", source);
    e.dataTransfer.setData("index", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const source = e.dataTransfer.getData("source");
    const draggedIndex = parseInt(e.dataTransfer.getData("index"));

    if (source === "available") {
      const newMerged = [...mergedOutput];
      newMerged.splice(dropIndex, 0, availableBlocks[draggedIndex]);
      setMergedOutput(newMerged);
      
      const newAvailable = availableBlocks.filter((_, i) => i !== draggedIndex);
      setAvailableBlocks(newAvailable);
    } else if (source === "merged") {
      const newMerged = [...mergedOutput];
      const [removed] = newMerged.splice(draggedIndex, 1);
      newMerged.splice(dropIndex, 0, removed);
      setMergedOutput(newMerged);
    }

    setDraggingIndex(null);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    const source = e.dataTransfer.getData("source");
    const draggedIndex = parseInt(e.dataTransfer.getData("index"));

    if (source === "merged") {
      setAvailableBlocks([...availableBlocks, mergedOutput[draggedIndex]]);
      setMergedOutput(mergedOutput.filter((_, i) => i !== draggedIndex));
    }

    setDraggingIndex(null);
  };

  const checkSolution = () => {
    const isCorrect =
      mergedOutput.length === level.solution.length &&
      mergedOutput.every((block, idx) => block === level.solution[idx]);

    if (isCorrect) {
      setMessages([
        ...messages,
        { type: "success", text: "✓ merge success: timeline repaired" },
      ]);
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setMessages([
        ...messages,
        { type: "error", text: "✗ merge failed: conflict unresolved" },
      ]);
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
            <FileCode className="w-5 h-5 text-primary" />
            <span className="font-semibold">main.c - Merge Conflict Resolution</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="panel p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span className="text-warning">!</span> Incoming & Current Conflicts
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{level.hint}</p>
          
          <div
            className="space-y-3 flex-1"
            onDragOver={handleDragOver}
            onDrop={handleDropToAvailable}
          >
            {availableBlocks.map((block, idx) => (
              <PuzzleTile
                key={`available-${idx}`}
                content={block}
                isDragging={draggingIndex === idx}
                onDragStart={(e) => handleDragStart(e, idx, "available")}
                onDragEnd={() => setDraggingIndex(null)}
              />
            ))}
          </div>
        </div>

        <div className="panel p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Merged Output</h2>
          
          <div className="space-y-3 flex-1 min-h-[300px]">
            {mergedOutput.map((block, idx) => (
              <div
                key={`merged-${idx}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
              >
                <PuzzleTile
                  content={block}
                  isDragging={draggingIndex === idx}
                  onDragStart={(e) => handleDragStart(e, idx, "merged")}
                  onDragEnd={() => setDraggingIndex(null)}
                />
              </div>
            ))}
            
            {mergedOutput.length === 0 && (
              <div
                className="editor-line h-32 flex items-center justify-center text-muted-foreground text-sm"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 0)}
              >
                Drop code blocks here to build the merge result
              </div>
            )}
            
            {mergedOutput.length > 0 && (
              <div
                className="editor-line h-16"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, mergedOutput.length)}
              />
            )}
          </div>

          <Button
            onClick={checkSolution}
            disabled={mergedOutput.length === 0}
            className="w-full mt-4 bg-success hover:bg-success/90 text-white"
          >
            Resolve Merge
          </Button>
        </div>
      </div>

      <div className="panel p-4">
        <div className="text-xs text-muted-foreground mb-2">
          Tip: Understanding merge conflict structure is key to real version control.
        </div>
        <Terminal messages={messages} />
      </div>
    </div>
  );
};
