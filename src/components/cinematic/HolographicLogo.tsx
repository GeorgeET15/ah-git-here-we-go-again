/**
 * Holographic Logo Component
 * Flickering holographic logo effect
 */

import { motion } from "framer-motion";

interface HolographicLogoProps {
  text: string;
}

export const HolographicLogo: React.FC<HolographicLogoProps> = ({ text }) => {
  return (
    <motion.div
      className="relative font-mono font-bold text-6xl md:text-7xl text-cyan-400"
      animate={{
        opacity: [1, 0.7, 1, 0.8, 1],
        filter: [
          "blur(0px)",
          "blur(1px)",
          "blur(0px)",
          "blur(0.5px)",
          "blur(0px)",
        ],
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        textShadow: "0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(6, 182, 212, 0.4)",
      }}
    >
      {text}
      {/* Holographic shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          backgroundSize: "200% 100%",
          mixBlendMode: "overlay",
        }}
      />
    </motion.div>
  );
};

