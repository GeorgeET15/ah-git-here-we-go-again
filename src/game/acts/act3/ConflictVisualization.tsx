import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConflictVisualizationProps {
  onComplete: () => void;
}

export const ConflictVisualization = ({ onComplete }: ConflictVisualizationProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 1000);
      return () => clearTimeout(timer);
    }
    if (step === 1) {
      const timer = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-6xl space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Understanding Merge Conflicts
          </h2>
          <p className="text-muted-foreground">
            What happens when two branches modify the same lines
          </p>
        </div>

        {/* Split Screen Comparison */}
        <div className="grid grid-cols-2 gap-8">
          {/* Main Branch Version */}
          <div className={`panel p-6 transition-all duration-500 ${step >= 1 ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="font-mono text-sm text-primary">main branch</span>
            </div>
            <div className="terminal-panel p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2"># main.py</div>
              <div className="text-foreground">def greet():</div>
              <div className="text-success ml-4">print("Hello from main branch")</div>
            </div>
          </div>

          {/* Feature Branch Version */}
          <div className={`panel p-6 transition-all duration-500 ${step >= 1 ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="mb-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="font-mono text-sm text-secondary">feature/login</span>
            </div>
            <div className="terminal-panel p-4 font-mono text-sm">
              <div className="text-muted-foreground mb-2"># main.py</div>
              <div className="text-foreground">def greet():</div>
              <div className="text-error ml-4">print("Hello from feature branch")</div>
            </div>
          </div>
        </div>

        {/* Collision Visualization */}
        {step >= 2 && (
          <div className="relative animate-scale-in">
            <div className="absolute inset-0 bg-error/10 rounded-lg blur-xl animate-pulse"></div>
            <div className="relative panel p-8 border-error/50 bg-error/5">
              <div className="flex items-center justify-center gap-4 mb-4">
                <AlertTriangle className="w-12 h-12 text-error animate-pulse" />
                <h3 className="text-2xl font-bold text-error">MERGE CONFLICT</h3>
                <AlertTriangle className="w-12 h-12 text-error animate-pulse" />
              </div>
              <p className="text-center text-foreground mb-6">
                Both branches modified the same line in different ways.
                <br />
                Git cannot automatically decide which version to keep.
              </p>
              <div className="flex justify-center">
                <Button onClick={onComplete} className="github-btn px-8 py-3">
                  Learn How to Resolve
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
