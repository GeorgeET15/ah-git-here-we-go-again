/**
 * Timer System
 * Manages countdown timer for boss battles
 */

export interface TimerState {
  timeRemaining: number;
  isPaused: boolean;
  isRunning: boolean;
  penalty: number;
}

export type TimerCallback = (time: number) => void;

export class TimerSystem {
  private state: TimerState = {
    timeRemaining: 0,
    isPaused: false,
    isRunning: false,
    penalty: 0,
  };

  private intervalId: NodeJS.Timeout | null = null;
  private tickCallbacks: TimerCallback[] = [];
  private expireCallbacks: (() => void)[] = [];

  /**
   * Start the timer
   */
  start(duration: number): void {
    this.state.timeRemaining = duration;
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.penalty = 0;

    this.intervalId = setInterval(() => {
      if (!this.state.isPaused && this.state.isRunning) {
        this.state.timeRemaining = Math.max(0, this.state.timeRemaining - 1);
        
        // Notify tick callbacks
        this.tickCallbacks.forEach((callback) => {
          callback(this.state.timeRemaining);
        });

        // Check if expired
        if (this.state.timeRemaining <= 0) {
          this.expire();
        }
      }
    }, 1000);
  }

  /**
   * Pause the timer
   */
  pause(): void {
    this.state.isPaused = true;
  }

  /**
   * Resume the timer
   */
  resume(): void {
    this.state.isPaused = false;
  }

  /**
   * Stop the timer
   */
  stop(): void {
    this.state.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Add time penalty
   */
  addPenalty(seconds: number): void {
    this.state.penalty += seconds;
    this.state.timeRemaining = Math.max(0, this.state.timeRemaining - seconds);
  }

  /**
   * Add time bonus
   */
  addBonus(seconds: number): void {
    this.state.timeRemaining += seconds;
  }

  /**
   * Register tick callback
   */
  onTick(callback: TimerCallback): () => void {
    this.tickCallbacks.push(callback);
    return () => {
      const index = this.tickCallbacks.indexOf(callback);
      if (index > -1) {
        this.tickCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Register expire callback
   */
  onExpire(callback: () => void): () => void {
    this.expireCallbacks.push(callback);
    return () => {
      const index = this.expireCallbacks.indexOf(callback);
      if (index > -1) {
        this.expireCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Handle timer expiration
   */
  private expire(): void {
    this.stop();
    this.expireCallbacks.forEach((callback) => {
      callback();
    });
  }

  /**
   * Get current state
   */
  getState(): TimerState {
    return { ...this.state };
  }

  /**
   * Format time as MM:SS
   */
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Reset timer
   */
  reset(): void {
    this.stop();
    this.state = {
      timeRemaining: 0,
      isPaused: false,
      isRunning: false,
      penalty: 0,
    };
    this.tickCallbacks = [];
    this.expireCallbacks = [];
  }
}

// Singleton instance
export const timerSystem = new TimerSystem();

