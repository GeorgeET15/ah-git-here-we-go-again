/**
 * Sound Cue System
 * Full implementation with Web Audio API
 */

export type SoundEvent = 
  | "success"
  | "failure"
  | "merge"
  | "timelinePop"
  | "notification"
  | "conflict"
  | "rebase"
  | "cherryPick"
  | "commit"
  | "branch"
  | "victory"
  | "defeat"
  | "click"
  | "hover"
  | "voice.ah_git_intro";

export const soundEvents: Record<SoundEvent, string> = {
  success: "/sounds/success.mp3",
  failure: "/sounds/error.mp3",
  merge: "/sounds/merge.mp3",
  timelinePop: "/sounds/pop.mp3",
  notification: "/sounds/notification.mp3",
  conflict: "/sounds/conflict.mp3",
  rebase: "/sounds/rebase.mp3",
  cherryPick: "/sounds/cherry-pick.mp3",
  commit: "/sounds/commit.mp3",
  branch: "/sounds/branch.mp3",
  victory: "/sounds/victory.mp3",
  defeat: "/sounds/defeat.mp3",
  click: "/sounds/click.mp3",
  hover: "/sounds/hover.mp3",
  "voice.ah_git_intro": "/sounds/voice-ah-git-intro.mp3", // Placeholder for future audio
};

/**
 * Hook for playing sounds
 */
export const useSound = (event: SoundEvent) => {
  return () => {
    soundManager.play(event);
  };
};

/**
 * Sound manager class - Full implementation
 */
export class SoundManager {
  private sounds: Map<SoundEvent, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;
  private loaded: boolean = false;

  /**
   * Load all sound files
   */
  async loadSounds(): Promise<void> {
    if (this.loaded) return;

    const loadPromises = Object.entries(soundEvents).map(async ([event, path]) => {
      try {
        const audio = new Audio(path);
        audio.preload = "auto";
        audio.volume = this.volume;
        
        // Wait for audio to be ready
        await new Promise<void>((resolve, reject) => {
          audio.addEventListener("canplaythrough", () => resolve(), { once: true });
          audio.addEventListener("error", () => {
            // Silently fail - sound file might not exist yet
            console.warn(`[SoundManager] Could not load sound: ${path}`);
            resolve();
          }, { once: true });
        });

        this.sounds.set(event as SoundEvent, audio);
      } catch (error) {
        console.warn(`[SoundManager] Failed to load sound ${event}:`, error);
      }
    });

    await Promise.all(loadPromises);
    this.loaded = true;
  }

  /**
   * Play a sound event
   */
  play(event: SoundEvent, volumeOverride?: number): void {
    if (!this.enabled) return;

    const audio = this.sounds.get(event);
    if (!audio) {
      // Try to load on-demand if not preloaded
      this.loadSoundOnDemand(event);
      return;
    }

    // Clone the audio element to allow overlapping sounds
    const audioClone = audio.cloneNode() as HTMLAudioElement;
    audioClone.volume = volumeOverride !== undefined ? volumeOverride : this.volume;
    
    audioClone.play().catch((error) => {
      // Silently fail if audio can't play (user interaction required, etc.)
      console.debug(`[SoundManager] Could not play sound ${event}:`, error);
    });
  }

  /**
   * Load a sound file on-demand
   */
  private async loadSoundOnDemand(event: SoundEvent): Promise<void> {
    const path = soundEvents[event];
    if (!path) return;

    try {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = "auto";
      
      await new Promise<void>((resolve) => {
        audio.addEventListener("canplaythrough", () => resolve(), { once: true });
        audio.addEventListener("error", () => resolve(), { once: true });
      });

      this.sounds.set(event, audio);
      this.play(event);
    } catch (error) {
      console.warn(`[SoundManager] Failed to load sound on-demand ${event}:`, error);
    }
  }

  /**
   * Set sound enabled/disabled
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    // Update volume for all loaded sounds
    this.sounds.forEach((audio) => {
      audio.volume = this.volume;
    });
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Get enabled state
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();

// Auto-load sounds when module is imported (non-blocking)
if (typeof window !== "undefined") {
  soundManager.loadSounds().catch(console.error);
}

