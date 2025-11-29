import { CommitNode as CommitNodeType } from "@/types/game";
import { GitCommit } from "lucide-react";

interface CommitNodeProps {
  commit: CommitNodeType;
  isDragging?: boolean;
  isInTrash?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const CommitNode = ({
  commit,
  isDragging,
  isInTrash,
  onDragStart,
  onDragEnd,
}: CommitNodeProps) => {
  const branchColor = commit.branch === "main" ? "bg-blue-500/20 border-blue-500/50" : "bg-purple-500/20 border-purple-500/50";
  const iconColor = commit.branch === "main" ? "text-blue-400" : "text-purple-400";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-full border
        transition-all cursor-move hover:scale-105 hover:shadow-lg
        ${branchColor}
        ${isDragging ? "opacity-30 scale-95" : ""}
        ${isInTrash ? "opacity-50" : ""}
      `}
    >
      <GitCommit className={`w-3 h-3 ${iconColor}`} />
      <span className="font-mono text-xs font-semibold">{commit.id}</span>
      <span className="text-xs text-muted-foreground">{commit.sha.slice(0, 7)}</span>
      <span className="text-xs max-w-[120px] truncate">{commit.message}</span>
    </div>
  );
};
