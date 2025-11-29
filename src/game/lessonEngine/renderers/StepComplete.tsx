/**
 * Step Renderer for Complete Steps
 */

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CompleteStep } from "../types";
import { SuccessBanner } from "@/ui/components/Feedback";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepCompleteProps {
  step: CompleteStep;
  onComplete?: () => void;
}

export const StepComplete: React.FC<StepCompleteProps> = ({ step, onComplete }) => {
  // Keyboard support - Enter to continue (required, no auto-advance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && onComplete) {
        e.preventDefault();
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-2xl w-full mx-4"
      >
        <SuccessBanner className="p-8" icon={null}>
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-success mb-2"
            >
              {step.message}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-4 border-t border-border"
            >
              <p className="text-sm text-muted-foreground mb-2">
                Press{" "}
                <kbd className="px-2 py-1 bg-muted border border-border rounded text-xs font-mono">
                  Enter
                </kbd>{" "}
                to continue to the next act
              </p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span>⏎</span>
                <span>Waiting for input...</span>
              </motion.div>
              <div className="mt-4">
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90 text-success-foreground font-mono text-xs"
                  onClick={() => onComplete && onComplete()}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </div>
        </SuccessBanner>
      </motion.div>
    </div>
  );
};
