/**
 * Hook to initialize sound system with user settings
 */

import { useEffect } from "react";
import { soundManager } from "@/audio/sounds";
import { useSettingsStore } from "@/game/state/settingsStore";

export const useSoundInitialization = () => {
  const { soundEnabled, soundVolume } = useSettingsStore();

  useEffect(() => {
    // Initialize sound manager with settings
    soundManager.setEnabled(soundEnabled);
    soundManager.setVolume(soundVolume);
    
    // Preload sounds (non-blocking)
    soundManager.loadSounds().catch(console.error);
  }, [soundEnabled, soundVolume]);
};

