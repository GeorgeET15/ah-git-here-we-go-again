/**
 * Animated Panel Component
 * Panel with fade-in and highlight animations
 */

import React from "react";
import { motion } from "framer-motion";
import { entrance, fadeInScale } from "@/ui/animation/motionPresets";
import { Panel, PanelProps } from "@/ui/components/Panel";

interface AnimatedPanelProps extends PanelProps {
  highlight?: boolean;
  delay?: number;
}

export const AnimatedPanel: React.FC<AnimatedPanelProps> = ({
  highlight = false,
  delay = 0,
  children,
  ...panelProps
}) => {
  return (
    <motion.div
      variants={entrance}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={
          highlight
            ? {
                boxShadow: [
                  "0 0 0px hsl(var(--primary))",
                  "0 0 20px hsl(var(--primary))",
                  "0 0 0px hsl(var(--primary))",
                ],
                opacity: 1,
              }
            : {
                opacity: 1,
              }
        }
        transition={{
          duration: 1,
          repeat: highlight ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        <Panel {...panelProps}>{children}</Panel>
      </motion.div>
    </motion.div>
  );
};

