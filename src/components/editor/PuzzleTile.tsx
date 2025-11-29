import { GripVertical } from "lucide-react";

interface PuzzleTileProps {
  content: string;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const PuzzleTile = ({
  content,
  isDragging,
  onDragStart,
  onDragEnd,
}: PuzzleTileProps) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        panel p-4 cursor-move transition-all hover:border-primary/50
        ${isDragging ? "opacity-50 scale-95" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        <pre className="font-mono text-sm text-card-foreground whitespace-pre-wrap break-all">
          {content}
        </pre>
      </div>
    </div>
  );
};
