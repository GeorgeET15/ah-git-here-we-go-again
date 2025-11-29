/**
 * Terminal Cursor Component
 * Blinking terminal cursor
 */

import { motion } from "framer-motion";

interface TerminalCursorProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const TerminalCursor: React.FC<TerminalCursorProps> = ({
  position = "bottom-right",
}) => {
  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 font-mono text-cyan-400`}
      animate={{
        opacity: [1, 0, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        textShadow: "0 0 10px rgba(6, 182, 212, 0.8)",
      }}
    >
      ▊
    </motion.div>
  );
};

