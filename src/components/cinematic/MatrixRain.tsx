/**
 * Matrix Rain Component
 * Falling code characters effect
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MatrixRainProps {
  intensity?: number; // 0-1, controls density
  speed?: number; // fall speed multiplier
}

const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

export const MatrixRain: React.FC<MatrixRainProps> = ({
  intensity = 0.3,
  speed = 1,
}) => {
  const [columns, setColumns] = useState<Array<{ id: number; chars: string[] }>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const columnCount = Math.floor(window.innerWidth / 20) * intensity;
    const newColumns = Array.from({ length: columnCount }, (_, i) => ({
      id: i,
      chars: Array.from({ length: 30 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ),
    }));
    setColumns(newColumns);
  }, [intensity]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {columns.map((column, colIndex) => (
        <div
          key={column.id}
          className="absolute top-0 font-mono text-xs text-cyan-400/20"
          style={{
            left: `${(colIndex / columns.length) * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          {column.chars.map((char, charIndex) => (
            <motion.div
              key={`${colIndex}-${charIndex}`}
              initial={{ y: -100, opacity: 0 }}
              animate={{
                y: typeof window !== "undefined" ? window.innerHeight + 100 : 1000,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3 / speed + Math.random() * 2,
                repeat: Infinity,
                delay: charIndex * 0.1 + Math.random() * 0.5,
                ease: "linear",
              }}
              style={{
                textShadow: "0 0 5px rgba(6, 182, 212, 0.5)",
              }}
            >
              {char}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

