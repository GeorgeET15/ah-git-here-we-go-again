/**
 * Screen Shake Component
 * Applies screen shake effect to children
 */

import { motion, Variants } from "framer-motion";
import { screenShake } from "@/ui/animation/bossEffects";

interface ScreenShakeProps {
  enabled: boolean;
  intensity?: number; // multiplier for shake intensity
  children: React.ReactNode;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  enabled,
  intensity = 1,
  children,
}) => {
  const shakeVariants: Variants = {
    normal: { x: 0, y: 0 },
    shake: {
      x: [0, -10 * intensity, 10 * intensity, -10 * intensity, 10 * intensity, -5 * intensity, 5 * intensity, 0],
      y: [0, -5 * intensity, 5 * intensity, -5 * intensity, 5 * intensity, -3 * intensity, 3 * intensity, 0],
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      initial="normal"
      animate={enabled ? "shake" : "normal"}
      variants={shakeVariants}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
};

