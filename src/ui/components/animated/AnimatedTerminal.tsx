/**
 * Animated Terminal Component
 * Terminal with typed text effect and success/error animations
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalLine } from "@/game/state/types";
import { shake, glowSuccess, glowError } from "@/ui/animation/motionPresets";

interface AnimatedTerminalProps {
  lines: TerminalLine[];
  onCommand?: (command: string) => void;
  className?: string;
}

export const AnimatedTerminal: React.FC<AnimatedTerminalProps> = ({
  lines,
  onCommand,
  className = "",
}) => {
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentLineText, setCurrentLineText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastErrorIndex, setLastErrorIndex] = useState(-1);

  useEffect(() => {
    if (lines.length === 0) {
      setDisplayedLines([]);
      setTypingIndex(0);
      setCurrentLineText("");
      return;
    }

    // Check if we have new lines
    if (lines.length > displayedLines.length) {
      const newLine = lines[displayedLines.length];
      
      // If it's a command, show immediately
      if (newLine.type === "command") {
        setDisplayedLines([...displayedLines, newLine]);
        setTypingIndex(displayedLines.length + 1);
        setCurrentLineText("");
        setIsTyping(false);
        return;
      }

      // For output/error/success, type it out
      setIsTyping(true);
      setCurrentLineText("");
      
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex < newLine.text.length) {
          setCurrentLineText(newLine.text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setDisplayedLines([...displayedLines, newLine]);
          setTypingIndex(displayedLines.length + 1);
          setCurrentLineText("");
          setIsTyping(false);
          
          // Track error for shake animation
          if (newLine.type === "error") {
            setLastErrorIndex(displayedLines.length);
          }
        }
      }, 20); // 20ms per character

      return () => clearInterval(typingInterval);
    }
  }, [lines, displayedLines]);

  const getLineColor = (type: TerminalLine["type"]) => {
    switch (type) {
      case "command":
        return "text-primary";
      case "error":
        return "text-error";
      case "success":
        return "text-success";
      default:
        return "text-foreground";
    }
  };

  return (
    <motion.div
      className={`terminal-panel p-4 font-mono text-sm overflow-y-auto ${className}`}
      animate={lastErrorIndex >= 0 ? "shake" : "normal"}
      variants={{
        shake: {
          x: [0, -5, 5, -5, 5, 0],
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        },
        normal: { x: 0 },
      }}
      onAnimationComplete={() => setLastErrorIndex(-1)}
    >
      <AnimatePresence>
        {displayedLines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={getLineColor(line.type)}
          >
            {line.type === "command" && (
              <span className="text-primary">$ </span>
            )}
            {line.text}
          </motion.div>
        ))}
        
        {isTyping && currentLineText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-foreground"
          >
            {currentLineText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ▊
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

