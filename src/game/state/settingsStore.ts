/**
 * Settings Store
 * User preferences and settings
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameSettings {
  // Sound settings
  soundEnabled: boolean;
  soundVolume: number;
  
  // Theme settings
  theme: "dark" | "light" | "system";
  
  // Gameplay settings
  hintsEnabled: boolean;
  autoAdvance: boolean;
  
  // Difficulty (for future use)
  difficulty: "easy" | "normal" | "hard";
  
  // Player info
  playerName: string;
}

interface SettingsStore extends GameSettings {
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setHintsEnabled: (enabled: boolean) => void;
  setAutoAdvance: (enabled: boolean) => void;
  setDifficulty: (difficulty: "easy" | "normal" | "hard") => void;
  setPlayerName: (name: string) => void;
  reset: () => void;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  soundVolume: 0.5,
  theme: "dark",
  hintsEnabled: true,
  autoAdvance: false,
  difficulty: "normal",
  playerName: "Engineer",
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
        // Update sound manager
        import("@/audio/sounds").then(({ soundManager }) => {
          soundManager.setEnabled(enabled);
        });
      },

      setSoundVolume: (volume) => {
        set({ soundVolume: volume });
        // Update sound manager
        import("@/audio/sounds").then(({ soundManager }) => {
          soundManager.setVolume(volume);
        });
      },

      setTheme: (theme) => set({ theme }),

      setHintsEnabled: (enabled) => set({ hintsEnabled: enabled }),

      setAutoAdvance: (enabled) => set({ autoAdvance: enabled }),

      setDifficulty: (difficulty) => set({ difficulty }),

      setPlayerName: (name) => set({ playerName: name }),

      reset: () => set(defaultSettings),
    }),
    {
      name: "ah-git-settings",
      version: 2,
    }
  )
);

