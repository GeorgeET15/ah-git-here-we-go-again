import { Level } from "@/types/game";

export const levels: Level[] = [
  {
    id: 1,
    name: "Simple Conflict",
    type: "merge",
    blocks: [
      "// Current Branch\nconst version = '1.0.0';",
      "// Incoming Branch\nconst version = '2.0.0';",
      "// Shared Code\nconsole.log('App starting...');",
    ],
    solution: [
      "// Incoming Branch\nconst version = '2.0.0';",
      "// Shared Code\nconsole.log('App starting...');",
    ],
    hint: "You're merging two branches with simple conflicting lines. Try building the merge result manually.",
    unlocked: true,
  },
  {
    id: 2,
    name: "Feature Merge",
    type: "merge",
    blocks: [
      "// Current: Old function\nfunction greet() {\n  return 'Hello';\n}",
      "// Incoming: New function\nfunction greet(name) {\n  return `Hello ${name}`;\n}",
      "// Export statement\nexport { greet };",
    ],
    solution: [
      "// Incoming: New function\nfunction greet(name) {\n  return `Hello ${name}`;\n}",
      "// Export statement\nexport { greet };",
    ],
    hint: "Sometimes only one version should remain. Decide which code the final merge should reflect.",
    unlocked: false,
  },
  {
    id: 3,
    name: "Rebase Timeline",
    type: "rebase",
    description: "Rewrite main's history by replaying the feature commits in the correct order.",
    commits: [
      { id: "A", sha: "a1b2c3d", message: "Initial commit", branch: "main" },
      { id: "B", sha: "e4f5g6h", message: "Add core features", branch: "main" },
      { id: "X", sha: "x9y8z7w", message: "Experimental (deprecated)", branch: "main" },
      { id: "C", sha: "c7d8e9f", message: "Refactor parser", branch: "feature" },
      { id: "D", sha: "d1e2f3g", message: "Fix critical bug", branch: "feature" },
    ],
    mainTimeline: ["A", "B", "X"],
    featureTimeline: ["C", "D"],
    correctTimeline: ["A", "B", "C", "D"],
    hint: "Rebase takes commits from one branch and replays them onto another, rewriting the history. Drag feature commits onto main and remove the bad commit.",
    unlocked: false,
  },
  {
    id: 4,
    name: "Cherry-Pick Power",
    type: "cherry-pick",
    description: "Extract the useful commit from the feature branch and apply it to main.",
    mainTimeline: ["A", "B"],
    featureTimeline: [
      { id: "C", sha: "c8d9e0f", message: "Fix crash on startup", key: true },
      { id: "D", sha: "d2e3f4g", message: "Refactor logging", key: false },
      { id: "E", sha: "e5f6g7h", message: "Broken disk IO patch", key: false },
    ],
    expectedFinal: ["A", "B", "C"],
    hint: "Cherry-pick allows you to apply a single commit from another branch. Choose wisely.",
    unlocked: false,
  },
];
