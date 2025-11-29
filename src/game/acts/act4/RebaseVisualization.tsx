import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, GitMerge, Zap } from "lucide-react";

interface RebaseVisualizationProps {
  onComplete: () => void;
}

export const RebaseVisualization = ({ onComplete }: RebaseVisualizationProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1500),
      setTimeout(() => setStep(2), 3500),
      setTimeout(() => setStep(3), 5500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-6xl space-y-12">
        {/* Title */}
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">Rebase: Time-Warp</h2>
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Rewrite history to create a clean, linear timeline
          </p>
        </div>

        {/* Before State */}
        <div className={`panel p-8 transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="mb-6 text-center">
            <span className="text-lg font-semibold text-foreground">
              {step === 0 && "Loading timeline..."}
              {step === 1 && "Before rebase: separate histories"}
              {step === 2 && "Replaying commits..."}
              {step >= 3 && "After rebase: clean linear history"}
            </span>
          </div>

          <div className="relative">
            {/* Before Rebase Timeline */}
            {step < 3 && (
              <svg width="100%" height="200" className="transition-all duration-700">
                {/* Main branch */}
                <line x1="10%" y1="60" x2="50%" y2="60" stroke="hsl(var(--primary))" strokeWidth="3" />
                <circle cx="20%" cy="60" r="12" fill="hsl(var(--primary))" className="animate-pulse" />
                <circle cx="35%" cy="60" r="12" fill="hsl(var(--primary))" className="animate-pulse" />
                <text x="20%" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12">A</text>
                <text x="35%" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12">B</text>
                <text x="10%" y="90" fill="hsl(var(--muted-foreground))" fontSize="14">main</text>

                {/* Feature branch */}
                <line x1="35%" y1="60" x2="35%" y2="140" stroke="hsl(var(--secondary))" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="35%" y1="140" x2="65%" y2="140" stroke="hsl(var(--secondary))" strokeWidth="3" />
                <circle 
                  cx="45%" 
                  cy="140" 
                  r="12" 
                  fill="hsl(var(--secondary))" 
                  className={step === 2 ? "animate-bounce" : ""}
                />
                <circle 
                  cx="60%" 
                  cy="140" 
                  r="12" 
                  fill="hsl(var(--secondary))" 
                  className={step === 2 ? "animate-bounce" : ""}
                  style={{ animationDelay: '0.2s' }}
                />
                <text x="45%" y="120" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="12">C</text>
                <text x="60%" y="120" textAnchor="middle" fill="hsl(var(--secondary))" fontSize="12">D</text>
                <text x="70%" y="140" fill="hsl(var(--muted-foreground))" fontSize="14">feature</text>
              </svg>
            )}

            {/* After Rebase Timeline */}
            {step >= 3 && (
              <svg width="100%" height="120" className="animate-fade-in">
                <line x1="10%" y1="60" x2="90%" y2="60" stroke="hsl(var(--primary))" strokeWidth="3" />
                <circle cx="20%" cy="60" r="12" fill="hsl(var(--primary))" className="animate-scale-in" />
                <circle cx="35%" cy="60" r="12" fill="hsl(var(--primary))" className="animate-scale-in" />
                <circle cx="50%" cy="60" r="12" fill="hsl(var(--success))" className="animate-scale-in" style={{ animationDelay: '0.1s' }} />
                <circle cx="65%" cy="60" r="12" fill="hsl(var(--success))" className="animate-scale-in" style={{ animationDelay: '0.2s' }} />
                <text x="20%" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12">A</text>
                <text x="35%" y="40" textAnchor="middle" fill="hsl(var(--primary))" fontSize="12">B</text>
                <text x="50%" y="40" textAnchor="middle" fill="hsl(var(--success))" fontSize="12">C'</text>
                <text x="65%" y="40" textAnchor="middle" fill="hsl(var(--success))" fontSize="12">D'</text>
                <text x="10%" y="90" fill="hsl(var(--muted-foreground))" fontSize="14">main (rebased)</text>
              </svg>
            )}
          </div>
        </div>

        {/* Comparison */}
        {step >= 3 && (
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            <div className="panel p-6 bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <GitMerge className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Merge</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Combines two histories with a merge commit. Preserves all original commits.
              </p>
            </div>

            <div className="panel p-6 bg-success/10 border-success/30">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-success">Rebase</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Rewrites history to be linear. Creates new commits on top of target branch.
              </p>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {step >= 3 && (
          <div className="flex justify-center animate-fade-in">
            <Button onClick={onComplete} className="github-btn px-10 py-4 text-lg">
              Try It Yourself
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
