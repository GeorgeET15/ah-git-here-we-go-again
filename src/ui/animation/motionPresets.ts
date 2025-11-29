/**
 * Motion Presets
 * Reusable animation variants for consistent animations across the app
 */

import { Variants } from "framer-motion";
import { easing } from "./easing";

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: easing.easeOut },
  },
};

export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: {
    opacity: 0,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easing.easeOut },
  },
};

// Slide animations
export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const slideInUp: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

export const slideInDown: Variants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: easing.easeOut },
  },
};

// Scale animations
export const scaleIn: Variants = {
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
};

export const scaleOut: Variants = {
  visible: { scale: 1, opacity: 1 },
  hidden: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
};

export const scaleBounce: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

export const scalePulse: Variants = {
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

// Spring animations
export const springPop: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
};

export const springGentle: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export const springBounce: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

// Glow animations
export const glowSuccess: Variants = {
  visible: {
    boxShadow: [
      "0 0 0px hsl(var(--success))",
      "0 0 20px hsl(var(--success))",
      "0 0 0px hsl(var(--success))",
    ],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export const glowError: Variants = {
  visible: {
    boxShadow: [
      "0 0 0px hsl(var(--error))",
      "0 0 20px hsl(var(--error))",
      "0 0 0px hsl(var(--error))",
    ],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export const glowPrimary: Variants = {
  visible: {
    boxShadow: [
      "0 0 0px hsl(var(--primary))",
      "0 0 20px hsl(var(--primary))",
      "0 0 0px hsl(var(--primary))",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

export const glowPulse: Variants = {
  visible: {
    boxShadow: [
      "0 0 10px rgba(255, 255, 255, 0.1)",
      "0 0 30px rgba(255, 255, 255, 0.3)",
      "0 0 10px rgba(255, 255, 255, 0.1)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

// Combined animations
export const entrance: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.easeOut,
    },
  },
};

export const exit: Variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
};

export const stagger: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Shake animation for errors
export const shake: Variants = {
  visible: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: easing.easeOut,
    },
  },
};

