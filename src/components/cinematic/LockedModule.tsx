/**
 * Locked Module Component
 * System module card with holographic disabled effect
 */

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface LockedModuleProps {
  title: string;
  subtitle: string;
  isUnlocked: boolean;
  onClick?: () => void;
}

export const LockedModule: React.FC<LockedModuleProps> = ({
  title,
  subtitle,
  isUnlocked,
  onClick,
}) => {
  return (
    <motion.div
      className={`relative border-2 p-6 font-mono ${
        isUnlocked
          ? "border-accent-cyan/50 bg-accent-cyan/5 cursor-pointer hover:border-accent-cyan hover:bg-accent-cyan/10"
          : "border-muted-foreground/30 bg-muted/20 cursor-not-allowed opacity-50"
      }`}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Holographic shimmer effect for locked state */}
      {!isUnlocked && (
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
            background: `linear-gradient(90deg, transparent, hsl(var(--accent-cyan) / 0.1), transparent)`,
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Lock icon */}
      {!isUnlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      <div className="space-y-2">
        <div
          className={`text-lg font-semibold ${
            isUnlocked ? "text-accent-cyan" : "text-muted-foreground"
          }`}
        >
          {title}
        </div>
        <div
          className={`text-sm ${
            isUnlocked ? "text-accent-cyan/80" : "text-muted-foreground/60"
          }`}
        >
          {subtitle}
        </div>
        {!isUnlocked && (
          <div className="text-xs text-error/60 mt-2">
            ACCESS RESTRICTED
          </div>
        )}
      </div>

      {/* Glow effect for unlocked */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0px hsl(var(--accent-cyan) / 0)",
              "0 0 20px hsl(var(--accent-cyan) / 0.4)",
              "0 0 0px hsl(var(--accent-cyan) / 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

