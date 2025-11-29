/**
 * Cinematic Engine
 * Orchestrates complex animation sequences and scene transitions
 */

import { lessonEventBus } from "@/game/events";
import { useSound, SoundEvent } from "@/audio/sounds";

export class CinematicEngine {
  private sequences: Map<string, () => Promise<void>> = new Map();
  private isPlaying: boolean = false;

  /**
   * Register an animation sequence
   */
  registerSequence(name: string, sequence: () => Promise<void>) {
    this.sequences.set(name, sequence);
  }

  /**
   * Play an animation sequence
   */
  async playSequence(name: string): Promise<void> {
    if (this.isPlaying) {
      console.warn(`[CinematicEngine] Sequence already playing, skipping: ${name}`);
      return;
    }

    const sequence = this.sequences.get(name);
    if (!sequence) {
      console.warn(`[CinematicEngine] Sequence not found: ${name}`);
      return;
    }

    this.isPlaying = true;
    try {
      await sequence();
    } finally {
      this.isPlaying = false;
    }
  }

  /**
   * Play act intro sequence
   */
  async playActIntro(actNumber: number): Promise<void> {
    // Emit events that components can listen to
    lessonEventBus.emit("cinematic.actIntro.start", { actNumber });
    
    // Wait for animations to complete
    await this.delay(600);
    
    lessonEventBus.emit("cinematic.actIntro.complete", { actNumber });
  }

  /**
   * Play commit animation sequence
   */
  async playCommitAnimation(commitId: string, message: string): Promise<void> {
    lessonEventBus.emit("timeline.addCommit", { commitId, message });
    
    // Play sound (future)
    const playSound = useSound("timelinePop");
    playSound();
    
    await this.delay(500);
  }

  /**
   * Play merge animation sequence
   */
  async playMergeAnimation(branchName: string): Promise<void> {
    lessonEventBus.emit("timeline.merge", { branchName });
    
    const playSound = useSound("merge");
    playSound();
    
    await this.delay(800);
  }

  /**
   * Play conflict animation sequence
   */
  async playConflictAnimation(): Promise<void> {
    lessonEventBus.emit("timeline.conflict", {});
    
    const playSound = useSound("conflict");
    playSound();
    
    await this.delay(600);
  }

  /**
   * Play rebase animation sequence
   */
  async playRebaseAnimation(): Promise<void> {
    lessonEventBus.emit("timeline.rebase", {});
    
    const playSound = useSound("rebase");
    playSound();
    
    await this.delay(1000);
  }

  /**
   * Play success celebration
   */
  async playSuccessCelebration(): Promise<void> {
    lessonEventBus.emit("cinematic.success", {});
    
    const playSound = useSound("success");
    playSound();
    
    await this.delay(1000);
  }

  /**
   * Play error animation
   */
  async playErrorAnimation(): Promise<void> {
    lessonEventBus.emit("cinematic.error", {});
    
    const playSound = useSound("failure");
    playSound();
    
    await this.delay(500);
  }

  /**
   * Utility: Delay execution
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const cinematicEngine = new CinematicEngine();

