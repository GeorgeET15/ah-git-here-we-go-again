/**
 * Settings Panel Component
 * User preferences and settings
 */

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Volume2, VolumeX, Palette, Lightbulb, Gamepad2 } from "lucide-react";
import { useSettingsStore } from "@/game/state/settingsStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const SettingsPanel: React.FC = () => {
  const {
    soundEnabled,
    soundVolume,
    theme,
    hintsEnabled,
    autoAdvance,
    difficulty,
    setSoundEnabled,
    setSoundVolume,
    setTheme,
    setHintsEnabled,
    setAutoAdvance,
    setDifficulty,
    reset,
  } = useSettingsStore();

  return (
    <TooltipProvider>
      <Sheet>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings & Preferences</p>
          </TooltipContent>
        </Tooltip>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Settings & Preferences
            </SheetTitle>
            <SheetDescription>
              Customize your game experience
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-8">
            {/* Sound Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
                <h3 className="text-lg font-semibold">Sound</h3>
              </div>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled">Enable Sounds</Label>
                  <Switch
                    id="sound-enabled"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                
                {soundEnabled && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound-volume">Volume</Label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(soundVolume * 100)}%
                      </span>
                    </div>
                    <Slider
                      id="sound-volume"
                      value={[soundVolume * 100]}
                      onValueChange={([value]) => setSoundVolume(value / 100)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Appearance</h3>
              </div>
              
              <div className="space-y-2 pl-7">
                <Label htmlFor="theme-select">Theme</Label>
                <Select value={theme} onValueChange={(value: "dark" | "light" | "system") => setTheme(value)}>
                  <SelectTrigger id="theme-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gameplay Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Gameplay</h3>
              </div>
              
              <div className="space-y-4 pl-7">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hints-enabled">Enable Hints</Label>
                    <p className="text-xs text-muted-foreground">
                      Show contextual hints during gameplay
                    </p>
                  </div>
                  <Switch
                    id="hints-enabled"
                    checked={hintsEnabled}
                    onCheckedChange={setHintsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-advance">Auto-Advance</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically proceed after completing steps
                    </p>
                  </div>
                  <Switch
                    id="auto-advance"
                    checked={autoAdvance}
                    onCheckedChange={setAutoAdvance}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty-select">Difficulty</Label>
                  <Select value={difficulty} onValueChange={(value: "easy" | "normal" | "hard") => setDifficulty(value)}>
                    <SelectTrigger id="difficulty-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Adjusts challenge difficulty (coming soon)
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={reset}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
};

