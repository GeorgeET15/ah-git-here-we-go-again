import { Level } from "@/types/game";
import { Lock } from "lucide-react";

interface LevelNodeProps {
  level: Level;
  position: { x: number; y: number };
  onClick: () => void;
}

export const LevelNode = ({ level, position, onClick }: LevelNodeProps) => {
  return (
    <g
      onClick={level.unlocked ? onClick : undefined}
      className="transition-all"
    >
      <circle
        cx={position.x}
        cy={position.y}
        r="24"
        className={
          level.unlocked
            ? "commit-unlocked"
            : "commit-locked"
        }
      />
      {!level.unlocked && (
        <g>
          <foreignObject
            x={position.x - 8}
            y={position.y - 8}
            width="16"
            height="16"
          >
            <Lock className="w-4 h-4 text-card-foreground" />
          </foreignObject>
        </g>
      )}
      <text
        x={position.x}
        y={position.y + 50}
        textAnchor="middle"
        className="text-xs font-sans fill-foreground"
      >
        {level.name}
      </text>
    </g>
  );
};
