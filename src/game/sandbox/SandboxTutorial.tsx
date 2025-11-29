/**
 * Sandbox Tutorial Component
 * Interactive walkthrough for Sandbox Mode
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text, Heading } from "@/ui/components/Typography";
import { ChevronLeft, ChevronRight, X, FileText, Code, Terminal, GitBranch, CheckCircle } from "lucide-react";
import { fadeInUp } from "@/ui/animation/motionPresets";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface SandboxTutorialProps {
  open: boolean;
  onClose: () => void;
}

export const SandboxTutorial: React.FC<SandboxTutorialProps> = ({ open, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: "Welcome to Sandbox Mode",
      description: "A free-form Git experimentation environment",
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Text>
            Sandbox Mode lets you experiment with Git commands in a safe, simulated environment.
            Practice what you've learned or try new commands without consequences.
          </Text>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <Text weight="semibold">What you can do:</Text>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Initialize repositories</li>
              <li>Create commits and branches</li>
              <li>Merge and rebase branches</li>
              <li>Resolve conflicts</li>
              <li>Explore Git history</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "File Explorer",
      description: "Browse and manage your repository files",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Text>
            The File Explorer shows all files in your repository. You can see file status
            (untracked, modified, staged) and open files for editing.
          </Text>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <Text weight="semibold">File Status Colors:</Text>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span>Untracked (new files)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span>Modified (changed files)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Staged (ready to commit)</span>
              </li>
            </ul>
          </div>
          <Text size="sm" variant="muted">
            Click on any file to open it in the editor.
          </Text>
        </div>
      ),
    },
    {
      title: "Code Editor",
      description: "Edit files with syntax highlighting",
      icon: <Code className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Text>
            The editor provides a full-featured code editor with syntax highlighting for
            JavaScript, Python, JSON, C++, HTML, CSS, and more.
          </Text>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <Text weight="semibold">Editor Features:</Text>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Syntax highlighting</li>
              <li>Line numbers</li>
              <li>Auto-indentation</li>
              <li>Bracket matching</li>
              <li>Save and reset changes</li>
            </ul>
          </div>
          <Text size="sm" variant="muted">
            Make changes to files, then use Git commands to stage and commit them.
          </Text>
        </div>
      ),
    },
    {
      title: "Terminal",
      description: "Execute Git commands",
      icon: <Terminal className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Text>
            The terminal is where you run Git commands. Type any Git command and see
            the results in real-time.
          </Text>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <Text weight="semibold">Try these commands:</Text>
            <div className="space-y-1 font-mono text-sm">
              <div className="text-primary">git init</div>
              <div className="text-muted-foreground">Initialize a new repository</div>
              <div className="text-primary mt-2">git status</div>
              <div className="text-muted-foreground">Check repository status</div>
              <div className="text-primary mt-2">git add .</div>
              <div className="text-muted-foreground">Stage all changes</div>
              <div className="text-primary mt-2">git commit -m "message"</div>
              <div className="text-muted-foreground">Create a commit</div>
            </div>
          </div>
          <Text size="sm" variant="muted">
            Enable hints in the header to get contextual suggestions.
          </Text>
        </div>
      ),
    },
    {
      title: "Timeline Visualizer",
      description: "Visualize your Git history",
      icon: <GitBranch className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Text>
            The Timeline shows a visual representation of your Git commit history,
            including branches, merges, and commit relationships.
          </Text>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <Text weight="semibold">What you'll see:</Text>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Commit nodes with SHA and message</li>
              <li>Branch lines connecting commits</li>
              <li>Current branch highlighted</li>
              <li>Merge connections</li>
            </ul>
          </div>
          <Text size="sm" variant="muted">
            The timeline updates automatically as you make commits and create branches.
          </Text>
        </div>
      ),
    },
    {
      title: "Getting Started",
      description: "Ready to experiment!",
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Text>
            You're all set! Here's a quick workflow to get started:
          </Text>
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="space-y-2">
              <Text weight="semibold">1. Initialize a repository</Text>
              <div className="font-mono text-sm text-primary ml-4">git init</div>
            </div>
            <div className="space-y-2">
              <Text weight="semibold">2. Create or edit files</Text>
              <Text size="sm" variant="muted" className="ml-4">
                Use the file explorer and editor to create files
              </Text>
            </div>
            <div className="space-y-2">
              <Text weight="semibold">3. Stage and commit</Text>
              <div className="font-mono text-sm text-primary ml-4">
                git add .<br />
                git commit -m "Initial commit"
              </div>
            </div>
            <div className="space-y-2">
              <Text weight="semibold">4. Create branches</Text>
              <div className="font-mono text-sm text-primary ml-4">git branch feature/new-feature</div>
            </div>
          </div>
          <Text size="sm" variant="muted">
            Use the Reset button to start fresh anytime, or load a sample repository to explore.
          </Text>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {currentStepData.icon}
            </div>
            <div className="flex-1">
              <DialogTitle>{currentStepData.title}</DialogTitle>
              <DialogDescription>{currentStepData.description}</DialogDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            className="py-4"
          >
            {currentStepData.content}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-primary"
                    : index < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                Get Started
                <CheckCircle className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

