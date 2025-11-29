import { CherryPickCommit } from "@/types/game";
import { GitCommit, Star } from "lucide-react";

interface CherryPickCommitNodeProps {
  commit: CherryPickCommit;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const CherryPickCommitNode = ({
  commit,
  isDragging,
  onDragStart,
  onDragEnd,
}: CherryPickCommitNodeProps) => {
  const baseStyle = commit.key
    ? "bg-warning/20 border-warning/60 hover:border-warning"
    : "bg-purple-500/20 border-purple-500/50 hover:border-purple-500";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-full border
        transition-all cursor-move hover:scale-105 hover:shadow-lg
        ${baseStyle}
        ${isDragging ? "opacity-30 scale-95" : ""}
      `}
    >
      {commit.key ? (
        <Star className="w-3 h-3 text-warning fill-warning" />
      ) : (
        <GitCommit className="w-3 h-3 text-purple-400" />
      )}
      <span className="font-mono text-xs font-semibold">{commit.id}</span>
      <span className="text-xs text-muted-foreground">{commit.sha.slice(0, 7)}</span>
      <span className="text-xs max-w-[140px] truncate">{commit.message}</span>
    </div>
  );
};
