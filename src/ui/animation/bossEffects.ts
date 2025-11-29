/**
 * Boss Battle Visual Effects
 * Chaos animations for the final boss fight
 */

import { Variants } from "framer-motion";
import { easing } from "./easing";

/**
 * Screen shake effect (for mistakes, warnings)
 */
export const screenShake: Variants = {
  visible: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    y: [0, -5, 5, -5, 5, -3, 3, 0],
    transition: {
      duration: 0.5,
      ease: easing.easeOut,
    },
  },
};

/**
 * Glitch overlay effect
 */
export const glitchOverlay: Variants = {
  visible: {
    opacity: [0, 0.3, 0, 0.2, 0, 0.1, 0],
    filter: [
      "hue-rotate(0deg)",
      "hue-rotate(90deg)",
      "hue-rotate(0deg)",
      "hue-rotate(-90deg)",
      "hue-rotate(0deg)",
    ],
    transition: {
      duration: 0.3,
      ease: easing.easeOut,
    },
  },
};

/**
 * Alarm border pulse (red border when time is low)
 */
export const alarmBorder: Variants = {
  visible: {
    boxShadow: [
      "0 0 0px hsl(var(--error))",
      "0 0 30px hsl(var(--error))",
      "0 0 0px hsl(var(--error))",
    ],
    borderColor: [
      "hsl(var(--error))",
      "hsl(var(--error))",
      "transparent",
      "hsl(var(--error))",
    ],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/**
 * Countdown timer pulse (when time < 30s)
 */
export const countdownPulse: Variants = {
  visible: {
    scale: [1, 1.1, 1],
    color: [
      "hsl(var(--foreground))",
      "hsl(var(--error))",
      "hsl(var(--foreground))",
    ],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/**
 * BugLord cut-in entrance
 */
export const bugLordCutIn: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -180 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    rotate: 180,
    transition: {
      duration: 0.3,
      ease: easing.easeIn,
    },
  },
};

/**
 * Timeline fracture animation
 */
export const timelineFracture: Variants = {
  visible: {
    opacity: [1, 0.7, 1, 0.8, 1],
    filter: [
      "blur(0px)",
      "blur(2px)",
      "blur(0px)",
      "blur(1px)",
      "blur(0px)",
    ],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/**
 * Victory celebration - confetti
 */
export const confetti: Variants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: [0, 200],
      opacity: [1, 0],
      rotate: [0, 360],
      transition: {
        duration: 2,
        ease: easing.easeOut,
      },
    },
  },
};

/**
 * BugLord defeat - dissolve into static
 */
export const bugLordDefeat: Variants = {
  visible: {
    opacity: [1, 0.8, 0.5, 0.2, 0],
    filter: [
      "blur(0px)",
      "blur(5px)",
      "blur(10px)",
      "blur(20px)",
      "blur(30px)",
    ],
    scale: [1, 1.2, 1.5, 2, 0],
    transition: {
      duration: 1.5,
      ease: easing.easeIn,
    },
  },
};

/**
 * Timeline stabilization (after victory)
 */
export const timelineStabilize: Variants = {
  hidden: { opacity: 0.5, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: easing.smooth,
    },
  },
};

