/**
 * Wireframe Grid Component
 * Scanning wireframe animation background
 */

import { motion } from "framer-motion";

interface WireframeGridProps {
  enabled?: boolean;
}

export const WireframeGrid: React.FC<WireframeGridProps> = ({
  enabled = true,
}) => {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Grid lines */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--success) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--success) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Scanning line */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "0% 100%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "linear-gradient(to bottom, transparent 0%, hsl(var(--success) / 0.3) 50%, transparent 100%)",
          backgroundSize: "100% 200px",
        }}
      />
    </div>
  );
};

