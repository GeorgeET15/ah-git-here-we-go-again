/**
 * Glitch Overlay Component
 * Creates RGB channel separation, scan lines, and digital noise effects
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GlitchOverlayProps {
  enabled: boolean;
  intensity?: number; // 0-1
  frequency?: number; // milliseconds between glitches
  children?: React.ReactNode;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({
  enabled,
  intensity = 0.5,
  frequency = 200,
  children,
}) => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setGlitch(false);
      return;
    }

    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, frequency);

    return () => clearInterval(interval);
  }, [enabled, frequency]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      {glitch && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, intensity, 0],
            filter: [
              "hue-rotate(0deg)",
              `hue-rotate(${Math.random() * 180 - 90}deg)`,
              "hue-rotate(0deg)",
            ],
          }}
          transition={{ duration: 0.1 }}
          style={{
            mixBlendMode: "screen",
            background: `
              linear-gradient(0deg, transparent 50%, rgba(255,0,0,0.1) 50%),
              linear-gradient(90deg, rgba(0,255,0,0.1) 50%, transparent 50%),
              linear-gradient(180deg, transparent 50%, rgba(0,0,255,0.1) 50%)
            `,
            backgroundSize: "100% 4px, 4px 100%, 100% 4px",
          }}
        />
      )}
      {/* Scan lines */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-40"
        animate={{
          backgroundPosition: ["0% 0%", "0% 100%"],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
      {/* Digital noise */}
      {glitch && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, intensity * 0.3, 0],
          }}
          transition={{ duration: 0.1 }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: intensity * 0.2,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
};

