/**
 * Step Renderer for Timeline Event Steps
 * Renders timeline visualizations based on event type
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TimelineStep } from "../types";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Text } from "@/ui/components/Typography";
import { GitBranch, GitCommit, GitMerge } from "lucide-react";
import {
  commitNodeAppear,
  branchLineDraw,
  mergeConnection,
  timelineStagger,
} from "@/game/animations/timelineAnimations";
import { soundManager } from "@/audio/sounds";

interface StepTimelineEventProps {
  step: TimelineStep;
}

export const StepTimelineEvent: React.FC<StepTimelineEventProps> = ({ step }) => {
  const [animationState, setAnimationState] = useState<"hidden" | "visible">("hidden");
  const { event, data } = step;

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setAnimationState("visible");
      
      // Play appropriate sound
      if (event.includes("commit")) {
        soundManager.play("commit");
      } else if (event.includes("merge")) {
        soundManager.play("merge");
      } else if (event.includes("branch")) {
        soundManager.play("branch");
      } else if (event.includes("initialize")) {
        soundManager.play("timelinePop");
      } else {
        soundManager.play("notification");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [event]);

  const renderTimelineVisualization = () => {
    switch (event) {
      case "timeline.initialize":
        return (
          <motion.svg
            width="100%"
            height="200"
            viewBox="0 0 400 200"
            initial="hidden"
            animate={animationState}
            variants={timelineStagger.container}
          >
            <motion.circle
              cx="100"
              cy="100"
              r="20"
              fill="hsl(var(--primary))"
              variants={commitNodeAppear}
              style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }}
            />
            <motion.text
              x="100"
              y="80"
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.3 }}
            >
              Repository Initialized
            </motion.text>
          </motion.svg>
        );

      case "timeline.stage":
        return (
          <motion.svg
            width="100%"
            height="200"
            viewBox="0 0 400 200"
            initial="hidden"
            animate={animationState}
            variants={timelineStagger.container}
          >
            <motion.circle
              cx="100"
              cy="100"
              r="20"
              fill="hsl(var(--muted))"
              variants={commitNodeAppear}
            />
            <motion.circle
              cx="200"
              cy="100"
              r="20"
              fill="#e3b341"
              variants={commitNodeAppear}
              style={{ filter: "drop-shadow(0 0 8px #e3b341)" }}
            />
            <motion.line
              x1="120"
              y1="100"
              x2="180"
              y2="100"
              stroke="hsl(var(--border))"
              strokeWidth="3"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.text
              x="200"
              y="80"
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.4 }}
            >
              Staged
            </motion.text>
          </motion.svg>
        );

      case "timeline.addCommit":
        return (
          <motion.svg
            width="100%"
            height="250"
            viewBox="0 0 500 250"
            initial="hidden"
            animate={animationState}
            variants={timelineStagger.container}
          >
            {/* Branch line */}
            <motion.line
              x1="50"
              y1="125"
              x2="450"
              y2="125"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              variants={branchLineDraw}
            />
            
            {/* Commit nodes */}
            {data?.commits?.map((commit: any, index: number) => (
              <g key={commit.sha || index}>
                <motion.circle
                  cx={100 + index * 150}
                  cy="125"
                  r="18"
                  fill="hsl(var(--primary))"
                  variants={commitNodeAppear}
                  style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary)))" }}
                />
                <motion.text
                  x={100 + index * 150}
                  y="100"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="12"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationState === "visible" ? 1 : 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {commit.sha?.substring(0, 7) || `C${index + 1}`}
                </motion.text>
                <motion.text
                  x={100 + index * 150}
                  y="155"
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="11"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationState === "visible" ? 1 : 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {commit.message?.substring(0, 20) || "Commit"}
                </motion.text>
              </g>
            )) || (
              <g>
                <motion.circle
                  cx="200"
                  cy="125"
                  r="18"
                  fill="hsl(var(--primary))"
                  variants={commitNodeAppear}
                  style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary)))" }}
                />
                <motion.text
                  x="200"
                  y="100"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="12"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationState === "visible" ? 1 : 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {data?.commitId?.substring(0, 7) || "a1b2c3d"}
                </motion.text>
                <motion.text
                  x="200"
                  y="155"
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="11"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: animationState === "visible" ? 1 : 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {data?.message || "New commit"}
                </motion.text>
              </g>
            )}
          </motion.svg>
        );

      case "timeline.createBranch":
        return (
          <motion.svg
            width="100%"
            height="300"
            viewBox="0 0 500 300"
            initial="hidden"
            animate={animationState}
            variants={timelineStagger.container}
          >
            {/* Main branch */}
            <motion.line
              x1="50"
              y1="100"
              x2="450"
              y2="100"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              variants={branchLineDraw}
            />
            
            {/* Feature branch */}
            <motion.line
              x1={data?.branchPoint || 200}
              y1="100"
              x2={data?.branchPoint || 200}
              y2="200"
              stroke="#3b82f6"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.line
              x1={data?.branchPoint || 200}
              y1="200"
              x2="450"
              y2="200"
              stroke="#3b82f6"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            
            {/* Commits on main */}
            <motion.circle
              cx={data?.branchPoint || 200}
              cy="100"
              r="18"
              fill="hsl(var(--primary))"
              variants={commitNodeAppear}
            />
            
            {/* Commits on feature branch */}
            {data?.featureCommits?.map((commit: any, index: number) => (
              <motion.circle
                key={commit.sha || index}
                cx={(data?.branchPoint || 200) + (index + 1) * 100}
                cy="200"
                r="18"
                fill="#3b82f6"
                variants={commitNodeAppear}
                style={{ filter: "drop-shadow(0 0 8px #3b82f6)" }}
              />
            ))}
            
            <motion.text
              x="250"
              y="230"
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.6 }}
            >
              {data?.branchName || "feature-branch"}
            </motion.text>
          </motion.svg>
        );

      case "timeline.merge":
        return (
          <motion.svg
            width="100%"
            height="300"
            viewBox="0 0 500 300"
            initial="hidden"
            animate={animationState}
            variants={timelineStagger.container}
          >
            {/* Main branch */}
            <motion.line
              x1="50"
              y1="100"
              x2="450"
              y2="100"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              variants={branchLineDraw}
            />
            
            {/* Feature branch merging */}
            <motion.path
              d={`M ${data?.branchPoint || 200} 100 L ${data?.branchPoint || 200} 200 L 450 200 L 450 100`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              variants={mergeConnection}
            />
            
            {/* Merge commit */}
            <motion.circle
              cx="450"
              cy="100"
              r="20"
              fill="hsl(var(--success))"
              variants={commitNodeAppear}
              style={{ filter: "drop-shadow(0 0 12px hsl(var(--success)))" }}
            />
            
            <motion.text
              x="450"
              y="75"
              textAnchor="middle"
              fill="hsl(var(--foreground))"
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: animationState === "visible" ? 1 : 0 }}
              transition={{ delay: 0.4 }}
            >
              Merge
            </motion.text>
          </motion.svg>
        );

      default:
        return (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <Text variant="muted">Timeline Event: {event}</Text>
            </div>
          </div>
        );
    }
  };

  return (
    <Panel className="w-full">
      <PanelHeader>
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-primary" />
          <Text weight="semibold">Timeline Event</Text>
        </div>
      </PanelHeader>
      <PanelContent>
        {renderTimelineVisualization()}
        {data?.description && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <Text size="sm" variant="muted">{data.description}</Text>
          </div>
        )}
      </PanelContent>
    </Panel>
  );
};

