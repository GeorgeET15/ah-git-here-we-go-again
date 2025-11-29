/**
 * Progression Roadmap Component
 * Horizontal act progression chips with connection lines
 */

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

interface ActStatus {
  label: string;
  complete: boolean;
  unlocked: boolean;
}

interface ProgressionRoadmapProps {
  acts: ActStatus[];
  arena: boolean; // Challenge mode unlocked
  lab: boolean; // Sandbox mode unlocked
  onActClick?: (actNumber: number) => void; // Callback when an act is clicked
}

export const ProgressionRoadmap: React.FC<ProgressionRoadmapProps> = ({
  acts,
  arena,
  lab,
  onActClick,
}) => {
  const handleActClick = (actNumber: number, unlocked: boolean) => {
    if (unlocked && onActClick) {
      onActClick(actNumber);
    }
  };

  return (
    <div className="w-full py-6 px-4 bg-card/30 border-y border-success/10">
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
        {acts.map((act, index) => {
          const actNumber = index + 1;
          const isClickable = act.unlocked && onActClick;
          
          return (
            <React.Fragment key={act.label}>
              <motion.div
                className={`relative px-4 py-2 rounded-lg font-mono text-sm font-semibold border-2 transition-all ${
                  act.complete
                    ? "bg-success/20 border-success text-success shadow-lg shadow-success/50"
                    : act.unlocked
                    ? "bg-muted/50 border-muted-foreground/30 text-muted-foreground"
                    : "bg-muted/30 border-muted/50 text-muted-foreground/60 opacity-50"
                } ${isClickable ? "cursor-pointer hover:scale-105 hover:border-success/50" : "cursor-default"}`}
                onClick={() => handleActClick(actNumber, act.unlocked)}
                initial={{ opacity: 1 }}
                whileHover={isClickable ? { scale: 1.05 } : undefined}
                whileTap={isClickable ? { scale: 0.95 } : undefined}
                animate={
                  act.complete
                    ? {
                        boxShadow: [
                          "0 0 0px hsl(var(--success) / 0)",
                          "0 0 20px hsl(var(--success) / 0.6)",
                          "0 0 0px hsl(var(--success) / 0)",
                        ],
                        opacity: 1,
                      }
                    : !act.unlocked
                    ? {
                        opacity: [0.5, 0.7, 0.5],
                      }
                    : {
                        opacity: 1,
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {act.complete ? (
                  <span className="text-success">✓ {act.label}</span>
                ) : act.unlocked ? (
                  <span>{act.label}</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>{act.label}</span>
                  </div>
                )}
              </motion.div>
              {index < acts.length - 1 && (
                <ArrowRight
                  className={`w-4 h-4 ${
                    act.complete ? "text-success" : "text-muted-foreground/60"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Arena */}
        <ArrowRight className="w-4 h-4 text-muted-foreground/60" />
        <motion.div
          className={`relative px-4 py-2 rounded-lg font-mono text-sm font-semibold border-2 transition-all ${
            arena
              ? "bg-success/20 border-success text-success shadow-lg shadow-success/50"
              : "bg-muted/30 border-muted/50 text-muted-foreground/60 opacity-50"
          }`}
          initial={{ opacity: 1 }}
          animate={
            arena
              ? {
                  boxShadow: [
                    "0 0 0px hsl(var(--success) / 0)",
                    "0 0 20px hsl(var(--success) / 0.6)",
                    "0 0 0px hsl(var(--success) / 0)",
                  ],
                  opacity: 1,
                }
              : {
                  opacity: [0.5, 0.7, 0.5],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {arena ? (
            <span className="text-success">✓ ARENA</span>
          ) : (
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>ARENA</span>
            </div>
          )}
        </motion.div>

        {/* Lab */}
        <ArrowRight className="w-4 h-4 text-muted-foreground/60" />
        <motion.div
          className={`relative px-4 py-2 rounded-lg font-mono text-sm font-semibold border-2 transition-all ${
            lab
              ? "bg-accent-purple/20 border-accent-purple text-accent-purple shadow-lg shadow-accent-purple/50"
              : "bg-muted/30 border-muted/50 text-muted-foreground/60 opacity-50"
          }`}
          initial={{ opacity: 1 }}
          animate={
            lab
              ? {
                  boxShadow: [
                    "0 0 0px hsl(var(--accent-purple) / 0)",
                    "0 0 20px hsl(var(--accent-purple) / 0.6)",
                    "0 0 0px hsl(var(--accent-purple) / 0)",
                  ],
                  opacity: 1,
                }
              : {
                  opacity: [0.5, 0.7, 0.5],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {lab ? (
            <span className="text-accent-purple">✓ LAB</span>
          ) : (
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>LAB</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

