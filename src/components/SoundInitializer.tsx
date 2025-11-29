/**
 * Sound Initializer Component
 * Initializes sound system with user settings on app load
 */

import { useEffect } from "react";
import { soundManager } from "@/audio/sounds";
import { useSettingsStore } from "@/game/state/settingsStore";

export const SoundInitializer: React.FC = () => {
  const { soundEnabled, soundVolume } = useSettingsStore();

  useEffect(() => {
    // Initialize sound manager with settings
    soundManager.setEnabled(soundEnabled);
    soundManager.setVolume(soundVolume);
    
    // Preload sounds (non-blocking)
    soundManager.loadSounds().catch(console.error);
  }, [soundEnabled, soundVolume]);

  return null; // This component doesn't render anything
};

