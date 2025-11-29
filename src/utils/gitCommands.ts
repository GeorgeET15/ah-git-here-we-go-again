export interface GitCommand {
  command: string;
  description: string;
  example: string;
  category: "basics" | "branching" | "merging" | "advanced";
}

export const gitCommands: GitCommand[] = [
  {
    command: "git init",
    description: "Initialize a new Git repository",
    example: "git init",
    category: "basics",
  },
  {
    command: "git add",
    description: "Add file contents to the staging area",
    example: "git add main.py",
    category: "basics",
  },
  {
    command: "git commit",
    description: "Record changes to the repository",
    example: 'git commit -m "Initial commit"',
    category: "basics",
  },
  {
    command: "git status",
    description: "Show the working tree status",
    example: "git status",
    category: "basics",
  },
  {
    command: "git branch",
    description: "List, create, or delete branches",
    example: "git branch feature-login",
    category: "branching",
  },
  {
    command: "git checkout",
    description: "Switch branches or restore working tree files",
    example: "git checkout feature-login",
    category: "branching",
  },
  {
    command: "git switch",
    description: "Switch branches (modern alternative to checkout)",
    example: "git switch feature-login",
    category: "branching",
  },
  {
    command: "git merge",
    description: "Join two or more development histories together",
    example: "git merge feature-login",
    category: "merging",
  },
  {
    command: "git rebase",
    description: "Reapply commits on top of another base tip",
    example: "git rebase main",
    category: "advanced",
  },
  {
    command: "git log",
    description: "Show commit logs",
    example: "git log --oneline",
    category: "basics",
  },
  {
    command: "git diff",
    description: "Show changes between commits, commit and working tree, etc",
    example: "git diff",
    category: "basics",
  },
  {
    command: "touch",
    description: "Create empty file(s) (Sandbox Mode)",
    example: "touch app.js index.html",
    category: "basics",
  },
  {
    command: "echo",
    description: "Create file with content (Sandbox Mode)",
    example: 'echo "console.log(\'Hello\');" > app.js',
    category: "basics",
  },
];
