/**
 * Sandbox Command Handlers
 * Extended command handlers for sandbox mode
 */

import { TerminalLine } from "@/game/state/types";
import { repoEnvironment, RepoEnvironment } from "./repoEnvironment";

export interface SandboxCommandResult {
  success: boolean;
  lines: TerminalLine[];
  updateState?: boolean; // Whether to trigger state update
}

export class SandboxCommandHandlers {
  private repo: RepoEnvironment;

  constructor(repo: RepoEnvironment) {
    this.repo = repo;
  }

  /**
   * Handle git status
   */
  handleStatus(): SandboxCommandResult {
    const state = this.repo.getState();
    const lines: TerminalLine[] = [
      { type: "output", text: `On branch ${state.currentBranch}` },
      { type: "output", text: "" },
    ];

    if (state.staged.length > 0) {
      lines.push({ type: "output", text: "Changes to be committed:" });
      state.staged.forEach(path => {
        lines.push({ type: "output", text: `  new file:   ${path}` });
      });
      lines.push({ type: "output", text: "" });
    }

    if (state.modified.length > 0) {
      lines.push({ type: "output", text: "Changes not staged for commit:" });
      state.modified.forEach(path => {
        lines.push({ type: "output", text: `  modified:   ${path}` });
      });
      lines.push({ type: "output", text: "" });
    }

    if (state.untracked.length > 0) {
      lines.push({ type: "output", text: "Untracked files:" });
      state.untracked.forEach(path => {
        lines.push({ type: "output", text: `  ${path}` });
      });
      lines.push({ type: "output", text: "" });
    }

    if (state.staged.length === 0 && state.modified.length === 0 && state.untracked.length === 0) {
      lines.push({ type: "success", text: "nothing to commit, working tree clean" });
    }

    return { success: true, lines, updateState: false };
  }

  /**
   * Handle git init
   */
  handleInit(): SandboxCommandResult {
    if (this.repo.getState().isInitialized) {
      return {
        success: false,
        lines: [
          { type: "error", text: "fatal: already a git repository" },
        ],
      };
    }

    this.repo.init();
    
    return {
      success: true,
      lines: [
        { type: "success", text: "Initialized empty Git repository" },
      ],
      updateState: true,
    };
  }

  /**
   * Handle git add
   */
  handleAdd(args: string[]): SandboxCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "fatal: pathspec required" },
        ],
      };
    }

    const paths = args[0] === "." ? this.repo.getState().modified.concat(this.repo.getState().untracked) : args;
    const staged: string[] = [];

    paths.forEach(path => {
      if (this.repo.stageFile(path)) {
        staged.push(path);
      }
    });

    if (staged.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "fatal: pathspec did not match any files" },
        ],
      };
    }

    return {
      success: true,
      lines: [
        { type: "success", text: `Staged ${staged.length} file(s)` },
      ],
      updateState: true,
    };
  }

  /**
   * Handle git commit
   */
  handleCommit(message?: string): SandboxCommandResult {
    const state = this.repo.getState();
    
    if (state.staged.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "nothing to commit, working tree clean" },
        ],
      };
    }

    if (!message) {
      return {
        success: false,
        lines: [
          { type: "error", text: "Aborting commit due to empty commit message." },
        ],
      };
    }

    const sha = this.repo.createCommit(message);
    const shortSha = sha.substring(0, 7);

    return {
      success: true,
      lines: [
        { type: "success", text: `[${state.currentBranch} ${shortSha}] ${message}` },
        { type: "output", text: ` ${state.staged.length} file(s) changed` },
      ],
      updateState: true,
    };
  }

  /**
   * Handle git branch
   */
  handleBranch(args: string[]): SandboxCommandResult {
    if (args.length === 0) {
      // List branches
      const state = this.repo.getState();
      const lines: TerminalLine[] = [];
      state.branches.forEach(branch => {
        const marker = branch.name === state.currentBranch ? "* " : "  ";
        lines.push({ type: "output", text: `${marker}${branch.name}` });
      });
      return { success: true, lines };
    }

    // Create branch
    const branchName = args[0];
    if (this.repo.createBranch(branchName)) {
      return {
        success: true,
        lines: [
          { type: "success", text: `Created branch '${branchName}'` },
        ],
        updateState: true,
      };
    } else {
      return {
        success: false,
        lines: [
          { type: "error", text: `fatal: A branch named '${branchName}' already exists.` },
        ],
      };
    }
  }

  /**
   * Handle git checkout / switch
   */
  handleCheckout(args: string[]): SandboxCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "fatal: you must specify a branch" },
        ],
      };
    }

    const branchName = args[0];
    if (this.repo.switchBranch(branchName)) {
      return {
        success: true,
        lines: [
          { type: "success", text: `Switched to branch '${branchName}'` },
        ],
        updateState: true,
      };
    } else {
      return {
        success: false,
        lines: [
          { type: "error", text: `fatal: branch '${branchName}' not found` },
        ],
      };
    }
  }

  /**
   * Handle git log
   */
  handleLog(oneline: boolean = false): SandboxCommandResult {
    const state = this.repo.getState();
    const commits = this.repo.getBranchCommits(state.currentBranch);
    
    if (commits.length === 0) {
      return {
        success: true,
        lines: [
          { type: "output", text: "No commits yet" },
        ],
      };
    }

    const lines: TerminalLine[] = [];
    
    commits.reverse().forEach(commit => {
      const shortSha = commit.sha.substring(0, 7);
      if (oneline) {
        lines.push({ type: "output", text: `${shortSha} ${commit.message}` });
      } else {
        lines.push({ type: "output", text: `commit ${commit.sha}` });
        lines.push({ type: "output", text: `Author: ${commit.author}` });
        lines.push({ type: "output", text: `Date: ${commit.date}` });
        lines.push({ type: "output", text: "" });
        lines.push({ type: "output", text: `    ${commit.message}` });
        lines.push({ type: "output", text: "" });
      }
    });

    return { success: true, lines };
  }

  /**
   * Handle git merge
   */
  handleMerge(args: string[]): SandboxCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "fatal: No branch specified for merge" },
        ],
      };
    }

    const branchName = args[0];
    const result = this.repo.mergeBranch(branchName);

    if (result.success) {
      return {
        success: true,
        lines: [
          { type: "success", text: `Merged branch '${branchName}' into ${this.repo.getState().currentBranch}` },
        ],
        updateState: true,
      };
    } else {
      return {
        success: false,
        lines: [
          { type: "error", text: `fatal: branch '${branchName}' not found` },
        ],
      };
    }
  }

  /**
   * Handle touch command (create empty file)
   */
  handleTouch(args: string[]): SandboxCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "touch: missing file operand" },
        ],
      };
    }

    const lines: TerminalLine[] = [];
    args.forEach(path => {
      const state = this.repo.getState();
      if (state.files[path]) {
        // File exists, just update timestamp (simulated)
        lines.push({ type: "output", text: `Updated: ${path}` });
      } else {
        // Create new file
        this.repo.setFile(path, "", "untracked");
        lines.push({ type: "success", text: `Created: ${path}` });
      }
    });

    return { success: true, lines, updateState: true };
  }

  /**
   * Handle echo command (create file with content)
   */
  handleEcho(args: string[]): SandboxCommandResult {
    if (args.length === 0) {
      return {
        success: false,
        lines: [
          { type: "error", text: "echo: missing arguments" },
        ],
      };
    }

    // Parse echo "content" > file or echo content > file
    const command = args.join(" ");
    const redirectMatch = command.match(/^(.+?)\s*>\s*(.+)$/);
    
    if (redirectMatch) {
      let content = redirectMatch[1].trim();
      const path = redirectMatch[2].trim();
      
      // Remove quotes if present
      if ((content.startsWith('"') && content.endsWith('"')) || 
          (content.startsWith("'") && content.endsWith("'"))) {
        content = content.slice(1, -1);
      }
      
      this.repo.setFile(path, content, "untracked");
      return {
        success: true,
        lines: [
          { type: "success", text: `Created file: ${path}` },
        ],
        updateState: true,
      };
    } else {
      // Just echo (no redirect)
      return {
        success: true,
        lines: [
          { type: "output", text: args.join(" ") },
        ],
      };
    }
  }

  /**
   * Parse and execute command
   */
  execute(command: string): SandboxCommandResult {
    const trimmed = command.trim();
    
    // Handle non-git commands first
    if (!trimmed.startsWith("git ")) {
      const parts = trimmed.split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);
      
      switch (cmd) {
        case "touch":
          return this.handleTouch(args);
        case "echo":
          return this.handleEcho(args);
        default:
          return {
            success: false,
            lines: [
              { type: "error", text: `Command not found: ${cmd}` },
              { type: "output", text: "Available commands: touch, echo, git" },
            ],
          };
      }
    }

    const parts = trimmed.substring(4).split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case "init":
        return this.handleInit();
      
      case "status":
        return this.handleStatus();
      
      case "add":
        return this.handleAdd(args);
      
      case "commit":
        const messageMatch = trimmed.match(/-m\s+"([^"]+)"/);
        const message = messageMatch ? messageMatch[1] : args.find(a => a !== "-m");
        return this.handleCommit(message);
      
      case "branch":
        return this.handleBranch(args);
      
      case "checkout":
      case "switch":
        return this.handleCheckout(args);
      
      case "log":
        const oneline = args.includes("--oneline");
        return this.handleLog(oneline);
      
      case "merge":
        return this.handleMerge(args);
      
      default:
        return {
          success: false,
          lines: [
            { type: "error", text: `git: '${cmd}' is not a git command.` },
            { type: "output", text: "See 'git --help' for available commands." },
          ],
        };
    }
  }
}

// Export singleton
export const sandboxCommandHandlers = new SandboxCommandHandlers(repoEnvironment);

