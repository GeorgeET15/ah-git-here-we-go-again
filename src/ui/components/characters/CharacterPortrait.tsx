/**
 * Character Portrait Component
 * Displays character with entrance/exit animations and expression support
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInScale, slideInLeft } from "@/ui/animation/motionPresets";
import { easing } from "@/ui/animation/easing";

export type CharacterType = "keif-x" | "buglord" | "system";
export type ExpressionType = "neutral" | "talk" | "warn" | "angry" | "happy";

interface CharacterPortraitProps {
  character: CharacterType;
  expression?: ExpressionType;
  size?: "sm" | "md" | "lg";
  show?: boolean;
  onAnimationComplete?: () => void;
}

const characterColors: Record<CharacterType, string> = {
  "keif-x": "hsl(var(--primary))",
  "buglord": "hsl(var(--error))",
  "system": "hsl(var(--muted-foreground))",
};

const characterNames: Record<CharacterType, string> = {
  "keif-x": "Keif-X",
  "buglord": "BugLord",
  "system": "System",
};

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
  expression = "neutral",
  size = "md",
  show = true,
  onAnimationComplete,
}) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check if dark mode
    const checkDarkMode = () => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        onComplete: onAnimationComplete,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: easing.easeIn,
      },
    },
  };

  const expressionVariants = {
    neutral: { scale: 1 },
    talk: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    warn: {
      scale: [1, 1.08, 1],
      rotate: [0, -2, 2, -2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    angry: {
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    happy: {
      scale: [1, 1.05, 1],
      y: [0, -5, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-2 flex items-center justify-center relative overflow-hidden`}
            style={{
              borderColor: characterColors[character],
              backgroundColor: `${characterColors[character]}20`,
            }}
            initial="neutral"
            variants={expressionVariants[expression]}
            animate={expression}
          >
            {/* Character Icon/Image */}
            {character === "keif-x" ? (
              <img
                src={isDark ? "/keif-logo-d.png" : "/keif-logo-l.png"}
                alt="Keif the Kraken"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className = "text-2xl font-bold";
                  fallback.style.color = characterColors[character];
                  fallback.textContent = "🤖";
                  target.parentElement?.appendChild(fallback);
                }}
              />
            ) : (
              <div className="text-2xl font-bold" style={{ color: characterColors[character] }}>
                {character === "buglord" && "👹"}
                {character === "system" && "⚙️"}
              </div>
            )}
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${characterColors[character]}40 0%, transparent 70%)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
          
          <motion.span
            className="text-xs font-medium"
            style={{ color: characterColors[character] }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {characterNames[character]}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

