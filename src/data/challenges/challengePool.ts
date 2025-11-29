/**
 * Challenge Pool
 * Dynamic Git challenges for Game Round mode
 */

import { GitChallenge } from "@/game/challenges/types";

export const challengePool: GitChallenge[] = [
  // ========== ACT 1 CONCEPTS ==========
  {
    id: "challenge-init-1",
    difficulty: "easy",
    category: "init",
    actNumber: 1,
    scenario: "You're starting a new project. Initialize a Git repository in the current directory.",
    bugDescription: "Error: not a git repository",
    visualContext: {
      terminalOutput: [
        "$ git status",
        "fatal: not a git repository",
        "(or any of the parent directories): .git"
      ]
    },
    correctCommand: "git init",
    commandPattern: "^git init$",
    basePoints: 100,
    timeBonus: 2,
    maxTime: 30,
    hints: [
      { level: 1, text: "You need to create a new Git repository", cost: 10 },
      { level: 2, text: "Use 'git init' to initialize a repository", cost: 25 },
      { level: 3, text: "Type: git init", cost: 50 }
    ],
    successMessage: "✅ Repository initialized successfully!",
    explanation: "git init creates a new Git repository in the current directory, initializing a .git folder that tracks all changes."
  },

  {
    id: "challenge-add-1",
    difficulty: "easy",
    category: "commit",
    actNumber: 1,
    scenario: "You've modified app.js. Stage this file for commit.",
    bugDescription: "Changes not staged for commit",
    visualContext: {
      terminalOutput: [
        "$ git status",
        "On branch main",
        "Changes not staged for commit:",
        "  modified:   app.js",
        "",
        "no changes added to commit"
      ]
    },
    correctCommand: "git add app.js",
    commandPattern: "^git add app\\.js$",
    alternativeCommands: ["git add ."],
    basePoints: 100,
    timeBonus: 2,
    maxTime: 30,
    hints: [
      { level: 1, text: "You need to stage the file before committing", cost: 10 },
      { level: 2, text: "Use 'git add' followed by the filename", cost: 25 },
      { level: 3, text: "Type: git add app.js", cost: 50 }
    ],
    successMessage: "✅ File staged for commit!",
    explanation: "git add stages files for commit. This prepares them to be included in the next commit."
  },

  {
    id: "challenge-commit-1",
    difficulty: "easy",
    category: "commit",
    actNumber: 1,
    scenario: "You've staged your changes. Create a commit with the message 'Add user authentication'.",
    bugDescription: "Nothing to commit",
    visualContext: {
      terminalOutput: [
        "$ git status",
        "On branch main",
        "Changes to be committed:",
        "  modified:   app.js",
        "",
        "Ready to commit"
      ]
    },
    correctCommand: "git commit -m \"Add user authentication\"",
    commandPattern: "^git commit -m \".+\"$",
    basePoints: 120,
    timeBonus: 2,
    maxTime: 45,
    hints: [
      { level: 1, text: "Use git commit with a message flag", cost: 15 },
      { level: 2, text: "Format: git commit -m \"your message\"", cost: 30 },
      { level: 3, text: "Type: git commit -m \"Add user authentication\"", cost: 60 }
    ],
    successMessage: "✅ Commit created successfully!",
    explanation: "git commit -m creates a commit with the specified message. This saves a snapshot of your staged changes."
  },

  // ========== ACT 2 CONCEPTS ==========
  {
    id: "challenge-branch-1",
    difficulty: "medium",
    category: "branch",
    actNumber: 2,
    scenario: "You need to work on a new feature without affecting main. Create a branch called 'feature-auth'.",
    bugDescription: "You're currently on main branch",
    visualContext: {
      terminalOutput: [
        "$ git branch",
        "* main"
      ]
    },
    correctCommand: "git branch feature-auth",
    commandPattern: "^git branch feature-auth$",
    basePoints: 150,
    timeBonus: 3,
    maxTime: 45,
    hints: [
      { level: 1, text: "Create a new branch for your feature", cost: 15 },
      { level: 2, text: "Use 'git branch' followed by the branch name", cost: 30 },
      { level: 3, text: "Type: git branch feature-auth", cost: 60 }
    ],
    successMessage: "✅ Branch 'feature-auth' created!",
    explanation: "git branch creates a new branch without switching to it. This allows parallel development."
  },

  {
    id: "challenge-checkout-1",
    difficulty: "medium",
    category: "branch",
    actNumber: 2,
    scenario: "Switch to the 'feature-auth' branch to start working on it.",
    bugDescription: "Currently on main branch",
    visualContext: {
      terminalOutput: [
        "$ git branch",
        "  feature-auth",
        "* main"
      ]
    },
    correctCommand: "git checkout feature-auth",
    commandPattern: "^git checkout feature-auth$",
    alternativeCommands: ["git switch feature-auth"],
    basePoints: 150,
    timeBonus: 3,
    maxTime: 45,
    hints: [
      { level: 1, text: "Switch to the feature branch", cost: 15 },
      { level: 2, text: "Use 'git checkout' followed by branch name", cost: 30 },
      { level: 3, text: "Type: git checkout feature-auth", cost: 60 }
    ],
    successMessage: "✅ Switched to branch 'feature-auth'!",
    explanation: "git checkout switches to the specified branch, allowing you to work on different features."
  },

  {
    id: "challenge-merge-1",
    difficulty: "medium",
    category: "merge",
    actNumber: 2,
    scenario: "You've finished the feature. Merge 'feature-auth' into 'main'. First switch to main, then merge.",
    bugDescription: "Feature branch not merged",
    visualContext: {
      terminalOutput: [
        "$ git branch",
        "* feature-auth",
        "  main"
      ]
    },
    correctCommand: "git checkout main && git merge feature-auth",
    commandPattern: "^git checkout main.*git merge feature-auth$",
    alternativeCommands: [
      "git checkout main",
      "git merge feature-auth"
    ],
    basePoints: 200,
    timeBonus: 4,
    maxTime: 60,
    hints: [
      { level: 1, text: "Switch to main, then merge the feature branch", cost: 20 },
      { level: 2, text: "Use 'git checkout main' then 'git merge feature-auth'", cost: 40 },
      { level: 3, text: "Type: git checkout main && git merge feature-auth", cost: 80 }
    ],
    successMessage: "✅ Feature branch merged successfully!",
    explanation: "git merge combines changes from one branch into another. Always merge into the target branch (main)."
  },

  // ========== ACT 3 CONCEPTS ==========
  {
    id: "challenge-conflict-1",
    difficulty: "hard",
    category: "conflict",
    actNumber: 3,
    scenario: "You tried to merge feature-branch into main, but there's a conflict in auth.js. Resolve it by keeping the incoming changes, then stage the file.",
    bugDescription: "CONFLICT: Merge conflict in auth.js",
    visualContext: {
      terminalOutput: [
        "$ git merge feature-branch",
        "Auto-merging auth.js",
        "CONFLICT (content): Merge conflict in auth.js",
        "Automatic merge failed; fix conflicts and then commit the result."
      ],
      errorMessage: "Merge conflict detected"
    },
    correctCommand: "git checkout --theirs auth.js && git add auth.js",
    commandPattern: "^git checkout --theirs auth\\.js.*git add auth\\.js$",
    alternativeCommands: [
      "git checkout --theirs auth.js",
      "git add auth.js"
    ],
    basePoints: 250,
    timeBonus: 5,
    maxTime: 120,
    hints: [
      { level: 1, text: "You need to choose which version to keep, then stage it", cost: 20 },
      { level: 2, text: "Use 'git checkout --theirs' to keep incoming, then 'git add'", cost: 40 },
      { level: 3, text: "Type: git checkout --theirs auth.js && git add auth.js", cost: 80 }
    ],
    successMessage: "✅ Conflict resolved and file staged!",
    explanation: "--theirs keeps the incoming changes during a merge conflict. Then git add stages the resolved file."
  },

  {
    id: "challenge-conflict-2",
    difficulty: "hard",
    category: "conflict",
    actNumber: 3,
    scenario: "After resolving a merge conflict in utils.js, you need to complete the merge by committing.",
    bugDescription: "All conflicts fixed but you haven't committed the merge",
    visualContext: {
      terminalOutput: [
        "$ git status",
        "On branch main",
        "All conflicts fixed but you are still merging.",
        "  (use \"git commit\" to conclude merge)"
      ]
    },
    correctCommand: "git commit",
    commandPattern: "^git commit$",
    basePoints: 200,
    timeBonus: 4,
    maxTime: 60,
    hints: [
      { level: 1, text: "Complete the merge with a commit", cost: 15 },
      { level: 2, text: "Use 'git commit' to finalize the merge", cost: 30 },
      { level: 3, text: "Type: git commit", cost: 60 }
    ],
    successMessage: "✅ Merge completed successfully!",
    explanation: "After resolving conflicts, git commit finalizes the merge and creates a merge commit."
  },

  // ========== ACT 4 CONCEPTS ==========
  {
    id: "challenge-rebase-1",
    difficulty: "hard",
    category: "rebase",
    actNumber: 4,
    scenario: "You want to rebase your feature branch onto the latest main. Switch to feature branch first, then rebase onto main.",
    bugDescription: "Feature branch is behind main",
    visualContext: {
      terminalOutput: [
        "$ git log --oneline",
        "a1b2c3d (main) Latest update",
        "f91d022 (HEAD -> feature) Old feature commit"
      ]
    },
    correctCommand: "git checkout feature && git rebase main",
    commandPattern: "^git checkout feature.*git rebase main$",
    alternativeCommands: [
      "git checkout feature",
      "git rebase main"
    ],
    basePoints: 250,
    timeBonus: 5,
    maxTime: 90,
    hints: [
      { level: 1, text: "Switch to feature branch, then rebase onto main", cost: 20 },
      { level: 2, text: "Use 'git checkout feature' then 'git rebase main'", cost: 40 },
      { level: 3, text: "Type: git checkout feature && git rebase main", cost: 80 }
    ],
    successMessage: "✅ Rebase completed!",
    explanation: "git rebase replays your commits on top of another branch, creating a linear history."
  },

  // ========== ACT 5 CONCEPTS ==========
  {
    id: "challenge-log-1",
    difficulty: "medium",
    category: "log",
    actNumber: 5,
    scenario: "You need to find a specific commit. Show the commit history in one-line format.",
    bugDescription: "Need to view commit history",
    visualContext: {
      terminalOutput: [
        "$ git log",
        "fatal: your current branch 'main' does not have any commits yet"
      ]
    },
    correctCommand: "git log --oneline",
    commandPattern: "^git log --oneline$",
    basePoints: 150,
    timeBonus: 3,
    maxTime: 45,
    hints: [
      { level: 1, text: "View commit history in a compact format", cost: 15 },
      { level: 2, text: "Use 'git log' with the '--oneline' flag", cost: 30 },
      { level: 3, text: "Type: git log --oneline", cost: 60 }
    ],
    successMessage: "✅ Commit history displayed!",
    explanation: "git log --oneline shows commit history in a compact, one-line format for easier reading."
  },

  {
    id: "challenge-cherry-pick-1",
    difficulty: "hard",
    category: "cherry-pick",
    actNumber: 5,
    scenario: "You found commit 'a1b2c3d' that fixes a critical bug. Apply it to your current branch using cherry-pick.",
    bugDescription: "Need to apply a specific commit",
    visualContext: {
      terminalOutput: [
        "$ git log --oneline",
        "a1b2c3d Fix critical bug",
        "f91d022 Previous commit"
      ]
    },
    correctCommand: "git cherry-pick a1b2c3d",
    commandPattern: "^git cherry-pick a1b2c3d$",
    basePoints: 250,
    timeBonus: 5,
    maxTime: 90,
    hints: [
      { level: 1, text: "Apply a specific commit to current branch", cost: 20 },
      { level: 2, text: "Use 'git cherry-pick' followed by commit SHA", cost: 40 },
      { level: 3, text: "Type: git cherry-pick a1b2c3d", cost: 80 }
    ],
    successMessage: "✅ Commit cherry-picked successfully!",
    explanation: "git cherry-pick applies a specific commit from another branch to your current branch."
  },

  // ========== STATUS & GENERAL ==========
  {
    id: "challenge-status-1",
    difficulty: "easy",
    category: "status",
    actNumber: 1,
    scenario: "Check the current status of your repository to see what files have been modified.",
    bugDescription: "Need to check repository status",
    visualContext: {
      terminalOutput: [
        "$ git status",
        "command not found: git"
      ]
    },
    correctCommand: "git status",
    commandPattern: "^git status$",
    basePoints: 100,
    timeBonus: 2,
    maxTime: 30,
    hints: [
      { level: 1, text: "Check the status of your repository", cost: 10 },
      { level: 2, text: "Use 'git status' to see current state", cost: 25 },
      { level: 3, text: "Type: git status", cost: 50 }
    ],
    successMessage: "✅ Repository status displayed!",
    explanation: "git status shows the current state of your working directory and staging area."
  },

  // Add more challenges covering edge cases and combinations
  {
    id: "challenge-combo-1",
    difficulty: "hard",
    category: "commit",
    actNumber: 1,
    scenario: "You've made changes to multiple files. Stage all changes and commit them with message 'Update project'.",
    bugDescription: "Multiple files modified, not committed",
    visualContext: {
      terminalOutput: [
        "$ git status",
        "Changes not staged:",
        "  modified:   app.js",
        "  modified:   utils.js",
        "  modified:   config.json"
      ]
    },
    correctCommand: "git add . && git commit -m \"Update project\"",
    commandPattern: "^git add \\.*git commit -m \".+\"$",
    alternativeCommands: [
      "git add .",
      "git commit -m \"Update project\""
    ],
    basePoints: 200,
    timeBonus: 4,
    maxTime: 60,
    hints: [
      { level: 1, text: "Stage all files, then commit with a message", cost: 20 },
      { level: 2, text: "Use 'git add .' then 'git commit -m \"message\"'", cost: 40 },
      { level: 3, text: "Type: git add . && git commit -m \"Update project\"", cost: 80 }
    ],
    successMessage: "✅ All changes committed!",
    explanation: "git add . stages all changes, then git commit -m creates a commit with your message."
  },
];

// Helper function to get challenges by difficulty
export const getChallengesByDifficulty = (difficulty: "easy" | "medium" | "hard"): GitChallenge[] => {
  return challengePool.filter(c => c.difficulty === difficulty);
};

// Helper function to get challenges by category
export const getChallengesByCategory = (category: string): GitChallenge[] => {
  return challengePool.filter(c => c.category === category);
};

// Helper function to get random challenges
export const getRandomChallenges = (count: number, difficulty?: "easy" | "medium" | "hard"): GitChallenge[] => {
  const pool = difficulty ? getChallengesByDifficulty(difficulty) : challengePool;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

