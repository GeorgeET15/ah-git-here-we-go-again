/**
 * Timeline Animations
 * Git-specific visual effects for timeline, commits, branches, merges
 */

import { Variants } from "framer-motion";
import { easing } from "@/ui/animation/easing";

/**
 * Commit node appearing animation
 */
export const commitNodeAppear: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

/**
 * Commit node with glow effect (success)
 */
export const commitNodeGlow: Variants = {
  visible: {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 0px hsl(var(--success))",
      "0 0 25px hsl(var(--success))",
      "0 0 0px hsl(var(--success))",
    ],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/**
 * Branch line drawing animation (for main branch baseline)
 */
export const branchLineDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing.easeOut,
    },
  },
};

/**
 * Branch line from parent to child commit (vertical connection)
 * Improved animation with smoother easing
 */
export const branchLineVertical: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1], // Custom smooth easing
      delay: 0.2,
    },
  },
};

/**
 * Branch line horizontal (feature branch)
 * Improved animation with sequential reveal
 */
export const branchLineHorizontal: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.4, 0, 0.2, 1], // Custom smooth easing
      delay: 0.4, // Start after vertical line completes
    },
  },
};

/**
 * Merge connection animation (two branches converging)
 * Uses path animation for smooth curve with improved timing
 */
export const mergeConnection: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.0,
      ease: [0.4, 0, 0.2, 1], // Custom smooth easing
      delay: 0.3,
    },
  },
};

/**
 * Rebase lift animation (commit moves up)
 */
export const rebaseLift: Variants = {
  hidden: { y: 0, opacity: 0.5 },
  visible: {
    y: -40,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing.easeOut,
    },
  },
};

/**
 * Rebase replay animation (commit appears in new position)
 */
export const rebaseReplay: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.3,
    },
  },
};

/**
 * Conflict explosion effect
 */
export const conflictExplosion: Variants = {
  hidden: { scale: 1, opacity: 1 },
  visible: {
    scale: [1, 1.3, 1],
    opacity: [1, 0.8, 1],
    boxShadow: [
      "0 0 0px hsl(var(--error))",
      "0 0 40px hsl(var(--error))",
      "0 0 0px hsl(var(--error))",
    ],
    transition: {
      duration: 0.5,
      ease: easing.easeOut,
    },
  },
};

/**
 * Timeline container stagger (for multiple commits)
 */
export const timelineStagger: Variants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
};

