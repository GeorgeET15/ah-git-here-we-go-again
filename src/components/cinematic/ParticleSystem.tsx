/**
 * Particle System Component
 * Creates particle burst effects for visual impact
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface ParticleSystemProps {
  enabled: boolean;
  count?: number;
  color?: string;
  duration?: number; // milliseconds
  origin?: { x: number; y: number }; // 0-1 normalized coordinates
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  enabled,
  count = 30,
  color = "hsl(var(--primary))",
  duration = 1000,
  origin = { x: 0.5, y: 0.5 },
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    // Generate particles
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: origin.x,
      y: origin.y,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      size: Math.random() * 4 + 2,
      color,
      life: 1,
    }));

    setParticles(newParticles);

    // Animate particles
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setParticles([]);
        clearInterval(interval);
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: 1 - progress,
        }))
      );
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [enabled, count, color, duration, origin]);

  if (!enabled || particles.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x * 100}%`,
            top: `${particle.y * 100}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            scale: [1, 0],
            opacity: [particle.life, 0],
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

