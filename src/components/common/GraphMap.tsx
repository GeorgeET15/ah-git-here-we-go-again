import { Level } from "@/types/game";
import { LevelNode } from "@/components/timeline/LevelNode";
import { GitBranch } from "lucide-react";
import { Panel } from "@/ui/components/Panel";
import { Heading } from "@/ui/components/Typography";
import { AppShell } from "@/ui/layout";

interface GraphMapProps {
  levels: Level[];
  onSelectLevel: (levelId: number) => void;
}

export const GraphMap = ({ levels, onSelectLevel }: GraphMapProps) => {
  const getNodePosition = (index: number) => {
    const baseX = 150;
    const baseY = 100;
    const spacing = 150;
    
    return {
      x: baseX + (index % 3) * spacing,
      y: baseY + Math.floor(index / 3) * spacing,
    };
  };

  const renderConnections = () => {
    return levels.slice(0, -1).map((_, idx) => {
      const start = getNodePosition(idx);
      const end = getNodePosition(idx + 1);
      
      return (
        <line
          key={`connection-${idx}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="4,4"
          className="opacity-50"
        />
      );
    });
  };

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center min-h-full">
        <Panel className="max-w-4xl w-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <GitBranch className="w-6 h-6 text-primary" />
            <Heading level={1}>Commit Graph - Timeline Repair</Heading>
          </div>
          
          <p className="text-muted-foreground mb-8">
            Navigate through the corrupted Git history. Click on unlocked commits to resolve conflicts.
          </p>

          <svg
            width="100%"
            height="400"
            viewBox="0 0 600 400"
            className="bg-editor rounded-md"
          >
            {renderConnections()}
            {levels.map((level, idx) => (
              <LevelNode
                key={level.id}
                level={level}
                position={getNodePosition(idx)}
                onClick={() => onSelectLevel(level.id)}
              />
            ))}
          </svg>
        </Panel>
      </div>
    </AppShell>
  );
};
