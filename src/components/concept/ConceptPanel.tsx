import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/ui/components/Panel";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export interface ConceptExplanation {
  title: string;
  command?: string;
  definition: string;
  realWorld: string;
  analogy: string;
  visual?: string;
  commonMistakes?: string;
  variations?: string;
  reflection?: string;
}

interface ConceptPanelProps {
  concept: ConceptExplanation;
  onContinue: () => void;
  show: boolean;
}

export const ConceptPanel = ({ concept, onContinue, show }: ConceptPanelProps) => {
  // Keyboard shortcuts
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, onContinue]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={onContinue}
          />
          
          <motion.div
            className="relative z-10 max-w-3xl w-full"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Panel className="max-w-2xl w-full shadow-2xl border-2 border-primary/20">
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
                        Learning Moment
                      </h2>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{concept.title}</h3>
                    {concept.command && (
                      <code className="inline-block px-3 py-1.5 bg-primary/10 border border-primary/30 rounded text-primary font-mono text-sm font-semibold mt-2">
                        {concept.command}
                      </code>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onContinue}
                    className="flex-shrink-0 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Simplified Core Explanation - Only show essential info */}
                <div className="space-y-3">
                  <div className="p-4 bg-success/10 border-l-4 border-success rounded-lg">
                    <p className="text-foreground leading-relaxed text-sm">{concept.definition}</p>
                  </div>

                  <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-lg">
                    <p className="text-foreground/90 leading-relaxed text-sm italic">{concept.analogy}</p>
                  </div>
                </div>

                {/* Optional: Show realWorld only if it's short and essential */}
                {concept.realWorld && concept.realWorld.length < 150 && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-foreground/80 text-sm leading-relaxed">{concept.realWorld}</p>
                  </div>
                )}

                {/* Continue Button - Simplified */}
                <div className="flex items-center justify-end pt-4 border-t border-border">
                  <Button
                    onClick={onContinue}
                    size="default"
                    className="gap-2 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </Panel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
