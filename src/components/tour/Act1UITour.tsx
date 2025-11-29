/**
 * Act 1 UI Tour Component
 * Interactive walkthrough of the UI when Act 1 starts
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Panel } from "@/ui/components/Panel";
import { Text, Heading } from "@/ui/components/Typography";
import { X, ArrowRight, Target, Code, Terminal, GitBranch, BookOpen } from "lucide-react";
import { fadeInUp } from "@/ui/animation/motionPresets";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for element to highlight
  position: "top" | "bottom" | "left" | "right" | "center";
  icon: React.ReactNode;
}

const tourSteps: TourStep[] = [
  {
    id: "reference",
    title: "Command Reference",
    description: "Click the book icon in the top bar to open Git command reference. Use it anytime you need help with Git commands.",
    target: "[data-tour='reference']",
    position: "bottom",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: "objectives",
    title: "Mission Objectives",
    description: "Track your progress here. Complete all objectives to restore system stability.",
    target: "[data-tour='objectives']",
    position: "bottom",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "editor",
    title: "Code Editor",
    description: "Fix broken code here. The editor shows line numbers and syntax highlighting.",
    target: "[data-tour='editor']",
    position: "left",
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: "terminal",
    title: "Terminal",
    description: "Run Git commands here. Type commands and see the output in real-time.",
    target: "[data-tour='terminal']",
    position: "top",
    icon: <Terminal className="w-5 h-5" />,
  },
  {
    id: "timeline",
    title: "Commit Timeline",
    description: "Visual representation of your Git history. Watch commits appear as you progress.",
    target: "[data-tour='timeline']",
    position: "top",
    icon: <GitBranch className="w-5 h-5" />,
  },
];

interface Act1UITourProps {
  onComplete: () => void;
}

export const Act1UITour: React.FC<Act1UITourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [show, setShow] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: string;
    left: string;
    transform: string;
  }>({ top: "50vh", left: "50vw", transform: "translate(-50%, -50%)" });
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Recalculate position when step changes, element changes, or window resizes
  useEffect(() => {
    if (!show) return;

    const step = tourSteps[currentStep];
    if (step) {
      const element = document.querySelector(step.target) as HTMLElement;
      setTargetElement(element);

      if (element) {
        // Scroll element into view
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, show]);

  // Recalculate tooltip position
  useEffect(() => {
    if (!targetElement || !tooltipRef.current) {
      setTooltipPosition({ top: "50vh", left: "50vw", transform: "translate(-50%, -50%)" });
      return;
    }

    const calculatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const padding = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Get actual tooltip dimensions
      const tooltipWidth = tooltipRef.current?.offsetWidth || 320;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 250;

      const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
      const margin = 10;
      const step = tourSteps[currentStep];

      let top = 0;
      let left = 0;
      let transform = "";

      switch (step.position) {
        case "top": {
          const desiredTop = rect.top - padding - tooltipHeight;
          const desiredLeft = rect.left + rect.width / 2;
          
          if (desiredTop < margin) {
            top = Math.min(rect.bottom + padding, viewportHeight - tooltipHeight - margin);
            transform = "translate(-50%, 0%)";
          } else {
            top = Math.max(margin, desiredTop);
            transform = "translate(-50%, -100%)";
          }
          
          left = clamp(desiredLeft, tooltipWidth / 2 + margin, viewportWidth - tooltipWidth / 2 - margin);
          break;
        }
        case "bottom": {
          const desiredTop = rect.bottom + padding;
          const desiredLeft = rect.left + rect.width / 2;
          
          if (desiredTop + tooltipHeight > viewportHeight - margin) {
            top = Math.max(margin, rect.top - padding - tooltipHeight);
            transform = "translate(-50%, -100%)";
          } else {
            top = Math.min(desiredTop, viewportHeight - tooltipHeight - margin);
            transform = "translate(-50%, 0%)";
          }
          
          left = clamp(desiredLeft, tooltipWidth / 2 + margin, viewportWidth - tooltipWidth / 2 - margin);
          break;
        }
        case "left": {
          const desiredLeft = rect.left - padding - tooltipWidth;
          const desiredTop = rect.top + rect.height / 2;
          
          if (desiredLeft < margin) {
            left = Math.min(rect.right + padding, viewportWidth - tooltipWidth - margin);
            transform = "translate(0%, -50%)";
          } else {
            left = Math.max(margin, desiredLeft);
            transform = "translate(-100%, -50%)";
          }
          
          top = clamp(desiredTop, tooltipHeight / 2 + margin, viewportHeight - tooltipHeight / 2 - margin);
          break;
        }
        case "right": {
          const desiredLeft = rect.right + padding;
          const desiredTop = rect.top + rect.height / 2;
          
          if (desiredLeft + tooltipWidth > viewportWidth - margin) {
            left = Math.max(margin, rect.left - padding - tooltipWidth);
            transform = "translate(-100%, -50%)";
          } else {
            left = Math.min(desiredLeft, viewportWidth - tooltipWidth - margin);
            transform = "translate(0%, -50%)";
          }
          
          top = clamp(desiredTop, tooltipHeight / 2 + margin, viewportHeight - tooltipHeight / 2 - margin);
          break;
        }
        default: {
          const desiredTop = rect.top + rect.height / 2;
          const desiredLeft = rect.left + rect.width / 2;
          
          top = clamp(desiredTop, tooltipHeight / 2 + margin, viewportHeight - tooltipHeight / 2 - margin);
          left = clamp(desiredLeft, tooltipWidth / 2 + margin, viewportWidth - tooltipWidth / 2 - margin);
          transform = "translate(-50%, -50%)";
          break;
        }
      }

      setTooltipPosition({
        top: `${Math.max(margin, Math.min(top, viewportHeight - tooltipHeight - margin))}px`,
        left: `${Math.max(margin, Math.min(left, viewportWidth - tooltipWidth - margin))}px`,
        transform,
      });
    };

    // Calculate position after a short delay to ensure tooltip is rendered
    const timeoutId = setTimeout(() => {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }, 100);
    
    // Recalculate on window resize/scroll
    const handleResize = () => {
      requestAnimationFrame(calculatePosition);
    };
    const handleScroll = () => {
      requestAnimationFrame(calculatePosition);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [targetElement, currentStep, show]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setShow(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  if (!show) return null;

  const step = tourSteps[currentStep];
  if (!step) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay with spotlight effect */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Highlight overlay */}
            {targetElement && (
              <motion.div
                className="absolute border-4 border-primary rounded-lg pointer-events-none"
                style={{
                  top: `${targetElement.getBoundingClientRect().top - 4}px`,
                  left: `${targetElement.getBoundingClientRect().left - 4}px`,
                  width: `${targetElement.getBoundingClientRect().width + 8}px`,
                  height: `${targetElement.getBoundingClientRect().height + 8}px`,
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 30px hsl(var(--primary) / 0.5)",
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.div>

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            className="fixed z-[9999] max-w-sm w-[320px]"
            style={{
              ...tooltipPosition,
              maxWidth: `min(320px, calc(100vw - 20px))`,
              maxHeight: `min(400px, calc(100vh - 20px))`,
            }}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Panel className="w-full shadow-2xl">
              <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                      {step.icon}
                    </div>
                    <div>
                      <Heading level={4} className="text-foreground">
                        {step.title}
                      </Heading>
                      <Text size="xs" variant="muted" className="mt-1">
                        Step {currentStep + 1} of {tourSteps.length}
                      </Text>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Description */}
                <Text size="sm" className="text-foreground/80">
                  {step.description}
                </Text>

                {/* Progress dots */}
                <div className="flex gap-2">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        index === currentStep
                          ? "bg-primary"
                          : index < currentStep
                          ? "bg-primary/50"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip Tour
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 gap-2"
                  >
                    {currentStep < tourSteps.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </div>
              </div>
            </Panel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

