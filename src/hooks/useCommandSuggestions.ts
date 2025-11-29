import { useState, useEffect } from "react";

export interface CommandSuggestion {
  command: string;
  hint: string;
}

export const useCommandSuggestions = (lessonState: string) => {
  const [suggestions, setSuggestions] = useState<CommandSuggestion[]>([]);

  useEffect(() => {
    // Update suggestions based on lesson state
    const newSuggestions = getSuggestionsForState(lessonState);
    setSuggestions(newSuggestions);
  }, [lessonState]);

  return suggestions;
};

const getSuggestionsForState = (state: string): CommandSuggestion[] => {
  const suggestionMap: Record<string, CommandSuggestion[]> = {
    // Act 1 - First Commit
    "act1-init": [
      { command: "git init", hint: "Initialize the repository" },
    ],
    "act1-add": [
      { command: "git add main.py", hint: "Stage the file" },
    ],
    "act1-commit": [
      { command: 'git commit -m "Initial commit"', hint: "Create your first commit" },
    ],

    // Act 2 - Branching
    "act2-create-branch": [
      { command: "git branch feature-login", hint: "Create a new branch" },
    ],
    "act2-checkout": [
      { command: "git checkout feature-login", hint: "Switch to the branch" },
    ],
    "act2-commit-feature": [
      { command: "git add main.py", hint: "Stage changes" },
      { command: 'git commit -m "Add login feature"', hint: "Commit on feature branch" },
    ],
    "act2-checkout-main": [
      { command: "git checkout main", hint: "Switch back to main" },
    ],
    "act2-merge": [
      { command: "git merge feature-login", hint: "Merge the feature branch" },
    ],

    // Act 3 - Conflict
    "act3-merge": [
      { command: "git merge feature/login", hint: "Attempt to merge (will conflict)" },
    ],
    "act3-resolve": [
      { command: "git add main.py", hint: "Stage the resolved file" },
      { command: "git commit", hint: "Complete the merge" },
    ],

    // Act 4 - Rebase
    "act4-checkout": [
      { command: "git checkout feature/login", hint: "Switch to feature branch" },
    ],
    "act4-rebase": [
      { command: "git rebase main", hint: "Rebase onto main" },
    ],

    // Act 5 - Cherry-Pick
    "act5-log": [
      { command: "git log --oneline", hint: "View commit history to find the missing commit" },
    ],
    "act5-cherry-pick": [
      { command: "git cherry-pick f91d022", hint: "Restore the missing commit using its SHA" },
    ],
  };

  return suggestionMap[state] || [];
};
