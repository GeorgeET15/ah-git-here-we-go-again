/**
 * Timeline Visualizer for Sandbox
 * Real-time commit graph visualization
 */

import React from "react";
import { motion } from "framer-motion";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Text } from "@/ui/components/Typography";
import { GitBranch } from "lucide-react";
import { GitCommit } from "./repoEnvironment";
import { commitNodeAppear, branchLineDraw, timelineStagger } from "@/game/animations/timelineAnimations";

interface TimelineVisualizerProps {
  commits: GitCommit[];
  branches: Array<{ name: string; head: string }>;
  currentBranch: string;
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({
  commits,
  branches,
  currentBranch,
}) => {
  // Group commits by branch
  const branchCommits: Record<string, GitCommit[]> = {};
  
  branches.forEach(branch => {
    const branchCommitsList: GitCommit[] = [];
    let currentSha = branch.head;
    const visited = new Set<string>();

    while (currentSha && !visited.has(currentSha)) {
      visited.add(currentSha);
      const commit = commits.find(c => c.sha === currentSha);
      if (commit) {
        branchCommitsList.push(commit);
        currentSha = commit.parent || "";
      } else {
        break;
      }
    }

    branchCommits[branch.name] = branchCommitsList.reverse();
  });

  const getBranchColor = (branchName: string): string => {
    if (branchName === currentBranch) {
      return "hsl(var(--primary))"; // Primary color for current branch
    }
    // Use a dark blue shade that matches the system
    return "#3b82f6"; // Dark blue (#3b82f6) - matches system blue-500
  };

  const getCommitPosition = (branchName: string, index: number, total: number) => {
    const baseX = 100;
    const baseY = branchName === "main" ? 200 : 400;
    const spacing = 200;
    
    return {
      x: baseX + index * spacing,
      y: baseY,
    };
  };

  return (
    <Panel className="h-full flex flex-col">
      <PanelHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <Text size="sm" weight="semibold">Timeline</Text>
        </div>
      </PanelHeader>
      <PanelContent className="flex-1 overflow-auto">
        {commits.length === 0 ? (
          <div className="text-center py-8">
            <Text size="sm" variant="muted">No commits yet</Text>
            <Text size="xs" variant="muted" className="mt-2">
              Start by initializing a repository
            </Text>
          </div>
        ) : (
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid meet"
            initial="hidden"
            animate="visible"
            variants={timelineStagger.container}
            className="w-full h-full"
            style={{ minHeight: "600px" }}
          >
            {branches.map(branch => {
              const branchCommitsList = branchCommits[branch.name] || [];
              const color = getBranchColor(branch.name);
              
              return (
                <g key={branch.name}>
                  {/* Branch line */}
                  {branchCommitsList.length > 1 && (
                    <motion.line
                      x1={getCommitPosition(branch.name, 0, branchCommitsList.length).x}
                      y1={getCommitPosition(branch.name, 0, branchCommitsList.length).y}
                      x2={getCommitPosition(branch.name, branchCommitsList.length - 1, branchCommitsList.length).x}
                      y2={getCommitPosition(branch.name, branchCommitsList.length - 1, branchCommitsList.length).y}
                      stroke={color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      variants={branchLineDraw}
                      className="drop-shadow-lg"
                    />
                  )}
                  
                  {/* Commits */}
                  {branchCommitsList.map((commit, index) => {
                    const pos = getCommitPosition(branch.name, index, branchCommitsList.length);
                    const shortSha = commit.sha.substring(0, 7);
                    
                    return (
                      <g key={commit.sha}>
                        <motion.circle
                          cx={pos.x}
                          cy={pos.y}
                          r="28"
                          fill={color}
                          stroke="hsl(var(--background))"
                          strokeWidth="3"
                          variants={commitNodeAppear}
                          className="drop-shadow-xl"
                        />
                        <motion.text
                          x={pos.x}
                          y={pos.y - 50}
                          textAnchor="middle"
                          fill={color}
                          fontSize="16"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="drop-shadow-lg"
                        >
                          {shortSha}
                        </motion.text>
                        <motion.text
                          x={pos.x}
                          y={pos.y + 65}
                          textAnchor="middle"
                          fill="hsl(var(--muted-foreground))"
                          fontSize="14"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="drop-shadow-md"
                        >
                          {commit.message.substring(0, 35)}
                        </motion.text>
                      </g>
                    );
                  })}
                  
                  {/* Branch label - always show for all branches */}
                  {branchCommitsList.length > 0 ? (
                    <text
                      x={getCommitPosition(branch.name, 0, branchCommitsList.length).x - 160}
                      y={getCommitPosition(branch.name, 0, branchCommitsList.length).y + 5}
                      fill={color}
                      fontSize="16"
                      fontWeight="bold"
                      className="drop-shadow-md"
                      textAnchor="end"
                    >
                      {branch.name}
                    </text>
                  ) : (
                    // Show branch label for empty branches at default position
                    <text
                      x={100 - 160}
                      y={branch.name === "main" ? 200 + 5 : 400 + 5}
                      fill={color}
                      fontSize="16"
                      fontWeight="bold"
                      className="drop-shadow-md"
                      textAnchor="end"
                    >
                      {branch.name}
                    </text>
                  )}
                </g>
              );
            })}
          </motion.svg>
        )}
      </PanelContent>
    </Panel>
  );
};

