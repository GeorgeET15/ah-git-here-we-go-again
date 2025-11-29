/**
 * Repository Environment
 * Simulated Git filesystem and repository state
 */

export interface GitFile {
  path: string;
  content: string;
  status: "tracked" | "modified" | "staged" | "untracked" | "deleted";
}

export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  parent: string | null;
  files: string[];
  tree: Record<string, string>; // path -> content snapshot
}

export interface GitBranch {
  name: string;
  head: string; // commit SHA
  remote?: string;
}

export interface RepositoryState {
  currentBranch: string;
  branches: GitBranch[];
  commits: GitCommit[];
  files: Record<string, GitFile>;
  staged: string[]; // file paths
  modified: string[]; // file paths
  untracked: string[]; // file paths
  isInitialized: boolean;
  HEAD: string; // current commit SHA
}

export class RepoEnvironment {
  private state: RepositoryState;
  private snapshots: RepositoryState[] = []; // For undo/reset

  constructor(initialState?: RepositoryState) {
    this.state = initialState || this.createEmptyState();
  }

  private createEmptyState(): RepositoryState {
    return {
      currentBranch: "main",
      branches: [],
      commits: [],
      files: {},
      staged: [],
      modified: [],
      untracked: [],
      isInitialized: false,
      HEAD: "",
    };
  }

  /**
   * Initialize repository
   */
  init(): void {
    // Reset to empty state first, then initialize
    this.state = this.createEmptyState();
    this.state.isInitialized = true;
    this.state.currentBranch = "main";
    this.state.branches = [{ name: "main", head: "" }];
  }

  /**
   * Get current state
   */
  getState(): RepositoryState {
    return { ...this.state };
  }

  /**
   * Get file content
   */
  getFile(path: string): GitFile | undefined {
    return this.state.files[path];
  }

  /**
   * Set file content
   */
  setFile(path: string, content: string, status: GitFile["status"] = "modified"): void {
    const existing = this.state.files[path];
    
    if (!existing) {
      // New file
      this.state.files[path] = {
        path,
        content,
        status: "untracked",
      };
      if (!this.state.untracked.includes(path)) {
        this.state.untracked.push(path);
      }
    } else {
      // Existing file
      this.state.files[path] = {
        ...existing,
        content,
        status: existing.status === "tracked" ? "modified" : existing.status,
      };
      
      // Update modified list
      if (existing.status === "tracked" && !this.state.modified.includes(path)) {
        this.state.modified.push(path);
      }
      
      // Remove from untracked if it was untracked
      if (this.state.untracked.includes(path)) {
        this.state.untracked = this.state.untracked.filter(p => p !== path);
      }
    }
  }

  /**
   * Stage file
   */
  stageFile(path: string): boolean {
    const file = this.state.files[path];
    if (!file) return false;

    if (file.status === "untracked" || file.status === "modified") {
      file.status = "staged";
      
      if (!this.state.staged.includes(path)) {
        this.state.staged.push(path);
      }
      
      // Remove from modified/untracked
      this.state.modified = this.state.modified.filter(p => p !== path);
      this.state.untracked = this.state.untracked.filter(p => p !== path);
      
      return true;
    }
    
    return false;
  }

  /**
   * Unstage file
   */
  unstageFile(path: string): boolean {
    if (!this.state.staged.includes(path)) return false;
    
    const file = this.state.files[path];
    if (file) {
      file.status = file.status === "staged" ? "modified" : file.status;
    }
    
    this.state.staged = this.state.staged.filter(p => p !== path);
    
    // If file was tracked, mark as modified
    if (file && this.state.commits.length > 0) {
      this.state.modified.push(path);
    }
    
    return true;
  }

  /**
   * Create commit
   */
  createCommit(message: string, author: string = "Developer"): string {
    if (this.state.staged.length === 0) {
      throw new Error("No changes staged for commit");
    }

    const sha = this.generateSHA();
    const parent = this.state.HEAD || null;
    
    // Create tree snapshot
    const tree: Record<string, string> = {};
    this.state.staged.forEach(path => {
      const file = this.state.files[path];
      if (file) {
        tree[path] = file.content;
      }
    });

    const commit: GitCommit = {
      sha,
      message,
      author,
      date: new Date().toISOString(),
      branch: this.state.currentBranch,
      parent,
      files: [...this.state.staged],
      tree,
    };

    this.state.commits.push(commit);
    this.state.HEAD = sha;
    
    // Update branch head
    const branch = this.state.branches.find(b => b.name === this.state.currentBranch);
    if (branch) {
      branch.head = sha;
    }

    // Clear staged files and mark as tracked
    this.state.staged.forEach(path => {
      const file = this.state.files[path];
      if (file) {
        file.status = "tracked";
      }
    });
    
    this.state.staged = [];
    this.state.modified = this.state.modified.filter(p => !commit.files.includes(p));
    this.state.untracked = this.state.untracked.filter(p => !commit.files.includes(p));

    return sha;
  }

  /**
   * Create branch
   */
  createBranch(name: string): boolean {
    if (this.state.branches.find(b => b.name === name)) {
      return false; // Branch already exists
    }

    this.state.branches.push({
      name,
      head: this.state.HEAD,
    });

    return true;
  }

  /**
   * Switch branch
   */
  switchBranch(name: string): boolean {
    const branch = this.state.branches.find(b => b.name === name);
    if (!branch) return false;

    this.state.currentBranch = name;
    this.state.HEAD = branch.head;
    
    return true;
  }

  /**
   * Get branch commits
   */
  getBranchCommits(branchName: string): GitCommit[] {
    const branch = this.state.branches.find(b => b.name === branchName);
    if (!branch) return [];

    // Find all commits reachable from branch head
    const commits: GitCommit[] = [];
    let currentSha = branch.head;
    const visited = new Set<string>();

    while (currentSha && !visited.has(currentSha)) {
      visited.add(currentSha);
      const commit = this.state.commits.find(c => c.sha === currentSha);
      if (commit) {
        commits.push(commit);
        currentSha = commit.parent || "";
      } else {
        break;
      }
    }

    return commits.reverse(); // Oldest first
  }

  /**
   * Get all commits (for timeline)
   */
  getAllCommits(): GitCommit[] {
    return [...this.state.commits];
  }

  /**
   * Get file tree structure
   */
  getFileTree(): Record<string, any> {
    const tree: Record<string, any> = {};
    
    Object.keys(this.state.files).forEach(path => {
      const parts = path.split("/");
      let current = tree;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          // File
          current[part] = this.state.files[path];
        } else {
          // Directory
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      }
    });
    
    return tree;
  }

  /**
   * Merge branch
   */
  mergeBranch(branchName: string): { success: boolean; conflicts?: string[] } {
    const branch = this.state.branches.find(b => b.name === branchName);
    if (!branch) {
      return { success: false };
    }

    // Simple merge - no conflict detection for now
    // In real implementation, would check for conflicts
    
    const mergeSha = this.generateSHA();
    const mergeCommit: GitCommit = {
      sha: mergeSha,
      message: `Merge branch '${branchName}'`,
      author: "Developer",
      date: new Date().toISOString(),
      branch: this.state.currentBranch,
      parent: this.state.HEAD,
      files: [],
      tree: {},
    };

    this.state.commits.push(mergeCommit);
    this.state.HEAD = mergeSha;
    
    const currentBranch = this.state.branches.find(b => b.name === this.state.currentBranch);
    if (currentBranch) {
      currentBranch.head = mergeSha;
    }

    return { success: true };
  }

  /**
   * Reset repository
   */
  reset(): void {
    this.state = this.createEmptyState();
    this.snapshots = [];
  }

  /**
   * Load from sample repository
   */
  loadSample(sample: any): void {
    if (sample.initialState) {
      this.state = {
        ...sample.initialState,
        files: { ...sample.initialState.files },
        branches: [...sample.initialState.branches],
        commits: [...sample.initialState.commits],
      };
      this.state.isInitialized = true;
    }
  }

  /**
   * Create snapshot for undo
   */
  snapshot(): void {
    this.snapshots.push(JSON.parse(JSON.stringify(this.state)));
    // Keep only last 10 snapshots
    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }
  }

  /**
   * Restore from snapshot
   */
  restore(): boolean {
    if (this.snapshots.length === 0) return false;
    this.state = this.snapshots.pop()!;
    return true;
  }

  /**
   * Generate fake SHA
   */
  private generateSHA(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

// Singleton instance
export const repoEnvironment = new RepoEnvironment();

