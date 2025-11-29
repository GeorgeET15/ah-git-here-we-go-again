/**
 * Conflict File Tab Component
 * Individual tab for navigating between conflicted files
 */

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { ConflictFile } from "@/game/logic/conflictSystem";

interface ConflictFileTabProps {
  file: ConflictFile;
  isActive: boolean;
  onClick: () => void;
}

export const ConflictFileTab: React.FC<ConflictFileTabProps> = ({
  file,
  isActive,
  onClick,
}) => {
  const unresolvedCount = file.conflicts.filter((c) => !c.resolved).length;

  return (
    <motion.button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-t-lg border-b-2 transition-all
        ${isActive
          ? "bg-card border-primary text-primary"
          : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{file.filename}</span>
        {file.resolved ? (
          <CheckCircle className="w-4 h-4 text-success" />
        ) : (
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4 text-error" />
            {unresolvedCount > 0 && (
              <span className="text-xs bg-error/20 text-error px-1.5 py-0.5 rounded">
                {unresolvedCount}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
};

