/**
 * Mission Briefing Panel Component
 * Story panel with act progress display
 */

import React from "react";
import { motion } from "framer-motion";

interface ActProgress {
  act1: boolean;
  act2: boolean;
  act3: boolean;
  act4: boolean;
  act5: boolean;
}

interface MissionBriefingPanelProps {
  storyText: string;
  actProgress: ActProgress;
}

export const MissionBriefingPanel: React.FC<MissionBriefingPanelProps> = ({
  storyText,
  actProgress,
}) => {
  const acts = [
    { label: "ACT 1", complete: actProgress.act1 },
    { label: "ACT 2", complete: actProgress.act2 },
    { label: "ACT 3", complete: actProgress.act3 },
    { label: "ACT 4", complete: actProgress.act4 },
    { label: "ACT 5", complete: actProgress.act5 },
  ];

  return (
    <div className="h-full bg-card/50 backdrop-blur-sm border border-success/20 rounded-lg p-6 overflow-y-auto shadow-lg">
      <h3 className="text-2xl font-bold text-success mb-4 font-mono">
        MISSION BRIEFING
      </h3>
      
      <div className="text-foreground/90 leading-relaxed space-y-4 mb-6">
        {storyText.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-sm md:text-base">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-success/20">
        <h4 className="text-lg font-semibold text-success mb-4 font-mono">
          OPERATION PROGRESS
        </h4>
        <div className="flex flex-wrap gap-2">
          {acts.map((act, index) => (
            <motion.div
              key={act.label}
              className={`px-3 py-2 rounded font-mono text-xs border ${
                act.complete
                  ? "bg-success/20 border-success/50 text-success"
                  : "bg-muted/50 border-muted-foreground/30 text-muted-foreground/60"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {act.label}: {act.complete ? "✓" : "○"}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


