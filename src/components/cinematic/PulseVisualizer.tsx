/**
 * Pulse Visualizer Component
 * Soundtrack pulse bar visualizer
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PulseVisualizerProps {
  enabled?: boolean;
  bars?: number;
}

export const PulseVisualizer: React.FC<PulseVisualizerProps> = ({
  enabled = true,
  bars = 20,
}) => {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: bars }, () => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [enabled, bars]);

  if (!enabled) return null;

  return (
    <div className="flex items-end justify-center gap-1 h-16 px-4">
      {heights.map((height, index) => (
        <motion.div
          key={index}
          className="w-1 bg-cyan-400/60"
          animate={{
            height: `${height}%`,
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
          style={{
            minHeight: "4px",
            boxShadow: "0 0 5px rgba(6, 182, 212, 0.5)",
          }}
        />
      ))}
    </div>
  );
};

