import { ConceptExplanation } from "@/components/concept/ConceptPanel";

export const conceptExplanations: Record<string, ConceptExplanation> = {
  // Act 1 - First Commit
  "git init": {
    title: "Starting Your Version Control Journey",
    command: "git init",
    definition:
      "Creates a new Git repository in the current directory, initializing a .git folder that tracks all changes to your project.",
    realWorld:
      "Every software project needs version control. Without it, you can't track changes, collaborate safely, or recover from mistakes. Git init is the foundation of professional development workflow.",
    analogy:
      "Like starting a new time-travel logbook for your project. Every change you make can be recorded, reviewed, and revisited.",
    commonMistakes:
      "Running git init inside an existing repository (creates nested repos). Running it in the wrong directory. Deleting the .git folder by accident (loses all history).",
    variations:
      "git init\ngit init <directory>\ngit init --bare (for remote repos)",
    reflection:
      "Why do you think version control is considered essential in modern software development?",
  },

  "git add": {
    title: "The Staging Area: Preparing Your Changes",
    command: "git add",
    definition:
      "Adds file changes to the staging area (also called the index), preparing them to be included in the next commit.",
    realWorld:
      "The staging area lets you carefully select which changes to commit. You might fix a bug AND add a feature, but want separate commits for clarity. Staging gives you that control.",
    analogy:
      "Like packing a box before shipping it. You choose exactly what goes in, review it, then seal it (commit) when ready.",
    commonMistakes:
      "Forgetting to stage changes before committing. Accidentally staging unwanted files (like passwords or large binaries). Not knowing you can stage partial file changes.",
    variations:
      "git add <file>\ngit add .\ngit add -A (all changes)\ngit add -p (interactive staging)",
    reflection:
      "Why might you want to stage only some changes instead of all changes at once?",
  },

  "git commit": {
    title: "Creating a Snapshot in Time",
    command: "git commit",
    definition:
      "Records staged changes as a new commit in the repository history. Each commit gets a unique ID (hash) and stores who made the change, when, and why (via message).",
    realWorld:
      "Commits are the building blocks of history. Good commits are small, focused, and have clear messages. They let you understand what changed and why, even years later.",
    analogy:
      "Like taking a photograph of your project at this exact moment. You can always return to this exact state, or see what changed since then.",
    commonMistakes:
      "Writing vague commit messages ('fix stuff', 'updates'). Making commits too large (mixing unrelated changes). Forgetting to write messages at all.",
    variations:
      'git commit -m "message"\ngit commit (opens editor)\ngit commit -a (stage and commit)\ngit commit --amend (modify last commit)',
    reflection:
      "What makes a commit message helpful to your future self or teammates?",
  },

  // Act 2 - Branching
  "git branch": {
    title: "Creating Parallel Timelines",
    command: "git branch",
    definition:
      "Creates a new branch, which is a lightweight movable pointer to a commit. Branches let you develop features, fix bugs, or experiment without affecting the main codebase.",
    realWorld:
      "Professional teams use branches for everything: features, bug fixes, experiments. It keeps work isolated and organized. Main branch stays stable while development happens elsewhere.",
    analogy:
      "Like creating a parallel universe where you can try things without affecting the original timeline. If the experiment works, you merge it back.",
    commonMistakes:
      "Forgetting to switch to the new branch after creating it. Creating branches with unclear names. Working directly on main instead of feature branches.",
    variations:
      "git branch <name>\ngit branch (list all)\ngit branch -d <name> (delete)\ngit branch -m <old> <new> (rename)",
    reflection:
      "Why is it safer to develop features on separate branches instead of directly on main?",
  },

  "git checkout": {
    title: "Switching Between Timelines",
    command: "git checkout",
    definition:
      "Switches your working directory to a different branch or commit. Updates all files to match that branch's state.",
    realWorld:
      "You constantly switch between branches in real development: reviewing pull requests, fixing urgent bugs, or continuing different features. Checkout lets you move freely through your project's history.",
    analogy:
      "Like switching between different save files in a game. Each branch is a different version of your project.",
    commonMistakes:
      "Switching branches with uncommitted changes (can lose work). Not knowing which branch you're on. Checking out commits directly (creates 'detached HEAD' state).",
    variations:
      "git checkout <branch>\ngit checkout -b <name> (create and switch)\ngit switch <branch> (modern alternative)",
    reflection:
      "What happens to your uncommitted changes when you switch branches?",
  },

  "git merge": {
    title: "Combining Histories Together",
    command: "git merge",
    definition:
      "Integrates changes from one branch into another. Git automatically combines the histories and creates a merge commit if needed.",
    realWorld:
      "Once a feature is complete and tested, you merge it into main so everyone gets the changes. Merging is how team work comes together into a unified codebase.",
    analogy:
      "Like merging two rivers into one. The waters combine, carrying everything from both sources downstream.",
    commonMistakes:
      "Merging without reviewing changes first. Not being on the correct branch when merging. Ignoring merge conflicts. Merging unfinished features into main.",
    variations:
      "git merge <branch>\ngit merge --no-ff (force merge commit)\ngit merge --squash (combine commits)\ngit merge --abort (cancel merge)",
    reflection:
      "When might you want a merge commit even if fast-forward is possible?",
  },

  // Act 3 - Merge Conflicts
  "merge-conflict": {
    title: "When Timelines Collide",
    command: "git merge (with conflicts)",
    definition:
      "A merge conflict occurs when two branches modify the same lines of code differently. Git can't automatically decide which version to keep, so it requires human judgment.",
    realWorld:
      "Conflicts are normal in team development. They happen when people work on related code simultaneously. Resolving them correctly is a critical skill for any developer.",
    analogy:
      "Like two editors making different changes to the same paragraph. Someone needs to read both versions and decide the final text.",
    commonMistakes:
      "Blindly accepting one side without understanding both changes. Leaving conflict markers in code. Not testing after resolving. Panicking instead of reading carefully.",
    variations:
      "Conflict markers:\n<<<<<<< HEAD (current branch)\n=======\n>>>>>>> branch-name (incoming)\n\nResolve, then:\ngit add <file>\ngit commit",
    reflection:
      "Why does Git require human input for conflicts instead of choosing automatically?",
  },

  // Act 4 - Rebase
  "git rebase": {
    title: "Rewriting History for Clarity",
    command: "git rebase",
    definition:
      "Replays commits from one branch on top of another, creating a linear history. It rewrites commit IDs, making the timeline cleaner and easier to follow.",
    realWorld:
      "Teams use rebase to keep history clean before merging features. Linear history is easier to understand, debug, and review. But rebase changes history, so never rebase public branches.",
    analogy:
      "Like copying your work from one notebook to another, page by page, in perfect order. The content is the same but the timeline is reorganized.",
    commonMistakes:
      "Rebasing public/shared branches (breaks others' work). Not understanding that commits get new IDs. Resolving conflicts incorrectly during rebase. Using rebase when merge is safer.",
    variations:
      "git rebase <branch>\ngit rebase -i (interactive rebase)\ngit rebase --continue\ngit rebase --abort",
    reflection:
      "Why should you never rebase commits that others have based work on?",
  },

  // Act 5 - Cherry-Pick
  "git log": {
    title: "Browsing Project History",
    command: "git log",
    definition:
      "Shows the commit history of the repository, displaying commits in reverse chronological order with their IDs, authors, dates, and messages.",
    realWorld:
      "Essential for debugging, understanding changes, finding when bugs were introduced, and tracking work. Every developer uses git log daily to navigate project history.",
    analogy:
      "CCTV footage of your time machine. You can see every moment in your project's timeline, who did what, and when.",
    commonMistakes:
      "Not using --oneline for cleaner output. Forgetting you can filter by author, date, or file. Not knowing about --graph for visual branch structure.",
    variations:
      "git log\ngit log --oneline (compact)\ngit log --graph (visual)\ngit log --all (all branches)\ngit log <file> (file history)",
    reflection:
      "How can git log help you understand why code was written a certain way?",
  },

  "git cherry-pick": {
    title: "Extracting Single Commits",
    command: "git cherry-pick",
    definition:
      "Applies a specific commit from one branch onto another branch. It extracts the changes from that commit and creates a new commit with the same changes on the target branch.",
    realWorld:
      "Perfect for hotfixes, rescuing important commits from deleted branches, or applying bug fixes to multiple branches. Cherry-pick lets you selectively grab commits without merging entire branches.",
    analogy:
      "Like copying a single page from one book to another. You take just that one page (commit) and insert it where you need it.",
    commonMistakes:
      "Cherry-picking commits that depend on other commits (missing context). Not understanding it creates new commit IDs. Cherry-picking public commits (duplicates history). Not handling conflicts properly.",
    variations:
      "git cherry-pick <commit-sha>\ngit cherry-pick <sha1> <sha2> (multiple)\ngit cherry-pick --abort (cancel)\ngit cherry-pick --continue (after resolving conflicts)",
    reflection:
      "When would cherry-pick be better than merging an entire branch?",
  },
};
