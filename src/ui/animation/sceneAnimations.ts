/**
 * Scene Animations
 * Complex animation sequences for cinematic scenes
 */

import { Variants } from "framer-motion";
import { easing } from "./easing";

/**
 * Act intro sequence: Title appears, then character, then dialog
 */
export const actIntroSequence: Variants = {
  title: {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easing.dramatic,
      },
    },
  },
  character: {
    hidden: { opacity: 0, x: -100, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  },
  dialog: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.4,
        ease: easing.easeOut,
      },
    },
  },
};

/**
 * Lesson step transition: Content fades out, new content fades in
 */
export const lessonStepTransition: Variants = {
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: easing.easeIn },
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easing.easeOut },
  },
};

/**
 * Panel reveal: Staggered reveal of multiple panels
 */
export const panelStagger: Variants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easing.easeOut,
      },
    },
  },
};

/**
 * Success celebration: Scale bounce with glow
 */
export const successCelebration: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
    },
  },
};

/**
 * Error shake: Horizontal shake with red glow
 */
export const errorShake: Variants = {
  visible: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    boxShadow: [
      "0 0 0px hsl(var(--error))",
      "0 0 20px hsl(var(--error))",
      "0 0 0px hsl(var(--error))",
    ],
    transition: {
      duration: 0.5,
      ease: easing.easeOut,
    },
  },
};

