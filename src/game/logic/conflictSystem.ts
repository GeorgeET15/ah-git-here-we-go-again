/**
 * Conflict System
 * Manages multi-file merge conflicts for boss battles
 */

export interface Conflict {
  id: string;
  startLine: number;
  endLine: number;
  currentContent: string;
  incomingContent: string;
  solution: "current" | "incoming" | "both";
  hint: string;
  resolved?: boolean;
  resolution?: string;
}

export interface ConflictFile {
  filename: string;
  path: string;
  conflicts: Conflict[];
  fullContent: string;
  resolved: boolean;
}

export interface BossConflictData {
  bossId: string;
  title: string;
  description: string;
  timeLimit: number;
  branches: string[];
  conflictedFiles: ConflictFile[];
  terminalCommands: {
    trigger: string;
    expectedSequence: string[];
  };
  bugLordInterrupts: Array<{
    trigger: string;
    threshold?: number;
    message: string;
  }>;
}

export class ConflictSystem {
  private files: Map<string, ConflictFile> = new Map();
  private bossData: BossConflictData | null = null;

  /**
   * Load boss conflict data
   */
  loadBossData(data: BossConflictData): void {
    this.bossData = data;
    this.files.clear();
    
    data.conflictedFiles.forEach((file) => {
      // Initialize conflicts as unresolved
      const conflicts = file.conflicts.map((conflict) => ({
        ...conflict,
        resolved: false,
      }));
      
      this.files.set(file.filename, {
        ...file,
        conflicts,
        resolved: false,
      });
    });
  }

  /**
   * Get all conflicted files
   */
  getConflictedFiles(): ConflictFile[] {
    return Array.from(this.files.values());
  }

  /**
   * Get a specific file
   */
  getFile(filename: string): ConflictFile | undefined {
    return this.files.get(filename);
  }

  /**
   * Resolve a conflict in a file
   */
  resolveConflict(
    filename: string,
    conflictId: string,
    resolution: "current" | "incoming" | "both"
  ): boolean {
    const file = this.files.get(filename);
    if (!file) return false;

    const conflict = file.conflicts.find((c) => c.id === conflictId);
    if (!conflict) return false;

    // Check if resolution matches expected solution
    const isCorrect = conflict.solution === resolution;

    // Apply resolution
    conflict.resolved = true;
    conflict.resolution = resolution;

    // Generate resolved content
    let resolvedContent = "";
    if (resolution === "current") {
      resolvedContent = conflict.currentContent;
    } else if (resolution === "incoming") {
      resolvedContent = conflict.incomingContent;
    } else if (resolution === "both") {
      // Combine both versions
      resolvedContent = conflict.currentContent + "\n" + conflict.incomingContent;
    }

    // Update file content (simplified - in real implementation would parse and replace)
    // For now, we just mark conflicts as resolved

    // Check if all conflicts in file are resolved
    file.resolved = file.conflicts.every((c) => c.resolved);

    return isCorrect;
  }

  /**
   * Check if all files are resolved
   */
  areAllResolved(): boolean {
    return Array.from(this.files.values()).every((file) => file.resolved);
  }

  /**
   * Get progress statistics
   */
  getProgress(): { resolved: number; total: number; filesResolved: number; filesTotal: number } {
    let totalConflicts = 0;
    let resolvedConflicts = 0;
    
    this.files.forEach((file) => {
      totalConflicts += file.conflicts.length;
      resolvedConflicts += file.conflicts.filter((c) => c.resolved).length;
    });

    const filesResolved = Array.from(this.files.values()).filter((f) => f.resolved).length;
    const filesTotal = this.files.size;

    return {
      resolved: resolvedConflicts,
      total: totalConflicts,
      filesResolved,
      filesTotal,
    };
  }

  /**
   * Get boss data
   */
  getBossData(): BossConflictData | null {
    return this.bossData;
  }

  /**
   * Reset all conflicts
   */
  reset(): void {
    this.files.forEach((file) => {
      file.resolved = false;
      file.conflicts.forEach((conflict) => {
        conflict.resolved = false;
        conflict.resolution = undefined;
      });
    });
  }
}

// Singleton instance
export const conflictSystem = new ConflictSystem();

