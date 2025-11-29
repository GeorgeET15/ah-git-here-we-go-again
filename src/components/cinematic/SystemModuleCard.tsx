/**
 * System Module Card Component
 * Enhanced module card with detailed descriptions and hologram effects
 */

import React from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Play, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SystemModuleCardProps {
  title: string;
  subtitle: string;
  description: string;
  isUnlocked: boolean;
  onClick?: () => void;
  icon?: "tutorial" | "challenge" | "sandbox";
}

const iconMap = {
  tutorial: BookOpen,
  challenge: Play,
  sandbox: Code,
};

export const SystemModuleCard: React.FC<SystemModuleCardProps> = ({
  title,
  subtitle,
  description,
  isUnlocked,
  onClick,
  icon = "tutorial",
}) => {
  const Icon = iconMap[icon];
  const colorClass = isUnlocked
    ? icon === "tutorial"
      ? "border-success/30 hover:border-success/50"
      : icon === "challenge"
      ? "border-success/30 hover:border-success/50"
      : "border-success/30 hover:border-success/50"
    : "border-muted/50 opacity-60";

  const bgClass = isUnlocked
    ? icon === "tutorial"
      ? "bg-success/5"
      : icon === "challenge"
      ? "bg-success/5"
      : "bg-success/5"
    : "bg-muted/30";

  const textColor = isUnlocked
    ? icon === "tutorial"
      ? "text-success"
      : icon === "challenge"
      ? "text-success"
      : "text-success"
    : "text-muted-foreground";

  return (
    <motion.div
      className={`relative ${bgClass} border-2 ${colorClass} rounded-lg p-6 transition-all duration-300 ${
        isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
      }`}
      whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Hologram shimmer effect */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `linear-gradient(90deg, transparent, hsl(var(--success) / 0.1), transparent)`,
            backgroundSize: "200% 100%",
          }}
        />
      )}

      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div
          className={`p-3 rounded-lg ${
            isUnlocked
              ? "bg-success/20"
              : "bg-muted/50"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isUnlocked ? textColor : "text-muted-foreground"
            }`}
          />
        </div>
        <div className="flex-1">
          <h3
            className={`text-xl font-bold font-mono mb-1 ${
              isUnlocked ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm ${
              isUnlocked ? "text-muted-foreground" : "text-muted-foreground/60"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 relative z-10">
        <p
          className={`text-sm leading-relaxed ${
            isUnlocked ? "text-foreground/80" : "text-muted-foreground/60"
          }`}
        >
          {description}
        </p>
      </div>

      {/* Action Button */}
      <div className="relative z-10">
        {isUnlocked ? (
          <Button
            className="w-full bg-success/20 hover:bg-success/30 border border-success/50 text-success font-mono"
            onClick={onClick}
          >
            {icon === "tutorial" ? "START" : icon === "challenge" ? "ENTER ARENA" : "OPEN LAB"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="px-4 py-2 bg-muted/50 border border-muted/50 rounded text-center text-muted-foreground/60 text-sm font-mono">
            {icon === "challenge"
              ? "LOCKED — Complete all 5 acts"
              : "LOCKED — Complete Act 2"}
          </div>
        )}
      </div>
    </motion.div>
  );
};


