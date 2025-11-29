import { CommandHandler, CommandContext, CommandResult } from "./commandEngine";
import { conceptExplanations } from "@/data/conceptExplanations";

/**
 * Command dictionary for Act 1 - First Commit
 */
export const act1Commands: Record<string, CommandHandler> = {
  "git init": (command, context) => {
    if (context.step === "init") {
      return {
        success: true,
        lines: [
          { type: "success", text: "Initialized empty Git repository in /project/.git/" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: A Git repository is a controlled timeline for your code." },
          { type: "output", text: "   It lets you track every change and restore or branch at any point." },
          { type: "output", text: "   Think of it like starting a new time-travel logbook for your project." },
          { type: "output", text: "" },
        ],
        nextStep: "add",
        showConcept: "git init",
      };
    }
    return null;
  },

  "git add main.py": (command, context) => {
    if (context.step === "add") {
      return {
        success: true,
        lines: [
          { type: "success", text: "Changes staged for commit" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: The staging area lets you prepare exactly what to commit." },
          { type: "output", text: "   Like packing a box before shipping - you choose what goes in." },
          { type: "output", text: "   This gives you control over your commit history." },
          { type: "output", text: "" },
        ],
        nextStep: "commit",
        showConcept: "git add",
      };
    }
    return null;
  },
};

/**
 * Command dictionary for Act 2 - Branching
 */
export const act2Commands: Record<string, CommandHandler> = {
  "git branch feature-login": (command, context) => {
    if (context.step === "create-branch") {
      return {
        success: true,
        lines: [
          { type: "success", text: "Created branch 'feature-login'" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: A branch creates a parallel line of development." },
          { type: "output", text: "   Like duplicating a save file before trying something risky." },
          { type: "output", text: "   The main branch stays stable while you experiment." },
          { type: "output", text: "" },
        ],
        nextStep: "checkout",
        showConcept: "git branch",
      };
    }
    return null;
  },

  "git checkout feature-login": (command, context) => {
    if (context.step === "checkout") {
      return {
        success: true,
        lines: [
          { type: "success", text: "Switched to branch 'feature-login'" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: Checkout switches your working directory to a different branch." },
          { type: "output", text: "   Like switching between different save files." },
          { type: "output", text: "   Your files update to match that branch's state." },
          { type: "output", text: "" },
        ],
        nextStep: "commit",
        showConcept: "git checkout",
      };
    }
    return null;
  },

  "git merge feature-login": (command, context) => {
    if (context.step === "merge") {
      return {
        success: true,
        lines: [
          { type: "output", text: "Updating a1b2c3d..b2c3d4e" },
          { type: "success", text: "Fast-forward" },
          { type: "output", text: " main.py | 5 +++++" },
          { type: "output", text: " 1 file changed, 5 insertions(+)" },
          { type: "success", text: "" },
          { type: "success", text: "💡 Concept: Merge combines changes from one branch into another." },
          { type: "output", text: "   Like merging two rivers - the waters combine into one." },
          { type: "output", text: "   This is how team work comes together." },
          { type: "output", text: "" },
          { type: "success", text: "🎉 Branch merged successfully!" },
          { type: "output", text: "" },
        ],
        nextStep: "complete",
        showConcept: "git merge",
      };
    }
    return null;
  },
};

/**
 * Command dictionary for Act 5 - Cherry Pick
 */
export const act5Commands: Record<string, CommandHandler> = {
  "git log --oneline": (command, context) => {
    if (context.step === "log") {
      return {
        success: true,
        lines: [
          { type: "output", text: "" },
          { type: "output", text: "a1b2c3f Add login feature" },
          { type: "error", text: "f91d022 Fix startup crash <--- THIS is the missing commit" },
          { type: "output", text: "c31ac44 Initial commit" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: git log shows project history" },
          { type: "output", text: "   Definition: browse commit history" },
          { type: "output", text: "   Real world: diagnose changes, locate bugs, track work" },
          { type: "output", text: "   Metaphor: CCTV footage of your time machine" },
          { type: "output", text: "" },
        ],
        nextStep: "cherry-pick",
        showConcept: "git log",
      };
    }
    return null;
  },

  "git cherry-pick f91d022": (command, context) => {
    if (context.step === "cherry-pick") {
      return {
        success: true,
        lines: [
          { type: "output", text: "Applying f91d022..." },
          { type: "output", text: "Restoring fix from deleted branch" },
          { type: "success", text: "Cherry-pick successful — commit replayed onto main" },
          { type: "output", text: "" },
          { type: "success", text: "💡 Concept: Cherry-pick = Extract a single commit and apply it elsewhere" },
          { type: "output", text: "   Used to rescue important changes without merging full branches" },
          { type: "output", text: "   Great for bug fixes and hotfixes" },
          { type: "output", text: "   Be careful with conflicts" },
          { type: "output", text: "" },
          { type: "success", text: "🎉 Production restored. You saved the project." },
          { type: "output", text: "" },
        ],
        nextStep: "complete",
        showConcept: "git cherry-pick",
      };
    }
    return null;
  },
};

/**
 * Get command handlers for a specific act
 */
export const getActCommands = (act: number): Record<string, CommandHandler> => {
  switch (act) {
    case 1:
      return act1Commands;
    case 2:
      return act2Commands;
    case 5:
      return act5Commands;
    default:
      return {};
  }
};


