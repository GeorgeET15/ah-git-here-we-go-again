import * as React from "react";
import { BookOpen, Settings, GitMerge, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GitReferencePanel } from "@/components/concept/GitReferencePanel";
import { SettingsPanel } from "@/ui/components/Settings/SettingsPanel";
import { useActState, useScreen, navigateToScreen } from "@/game/state/selectors";

export interface AppBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showCommandReference?: boolean;
  showSettings?: boolean;
}

const AppBar = React.forwardRef<HTMLDivElement, AppBarProps>(
  ({ className, title = "Ah Git", showCommandReference = true, showSettings = true, ...props }, ref) => {
    const actState = useActState();
    const screen = useScreen();
    
    const getActLabel = () => {
      // Don't show act label if title is explicitly set to something other than default
      if (title !== "Ah Git") return null;
      
      if (actState === "idle" || actState === "act1") return "Act 1";
      if (actState.startsWith("act2")) return "Act 2";
      if (actState.startsWith("act3")) return "Act 3";
      if (actState.startsWith("act4")) return "Act 4";
      if (actState.startsWith("act5")) return "Act 5";
      if (actState === "map" || actState === "puzzle") return "Puzzle Mode";
      return null;
    };
    
    const isInAct = screen?.startsWith("act") || screen === "lesson" || screen === "story";
    
    const handleGoHome = () => {
      console.log("🏠 [AppBar] Home button clicked, navigating to home");
      navigateToScreen("home");
    };

    return (
      <div
        ref={ref}
        className={cn(
          "h-14 border-b border-border bg-card/50 backdrop-blur-sm",
          "flex items-center justify-between px-4",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
          {getActLabel() && (
            <div className="px-2 py-1 rounded bg-primary/10 border border-primary/30">
              <span className="text-xs font-mono text-primary">{getActLabel()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isInAct && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoHome}
              className="h-9 w-9"
              title="Return to Home"
            >
              <Home className="w-4 h-4" />
            </Button>
          )}
          {showCommandReference && (
            <GitReferencePanel />
          )}
          {showSettings && (
            <SettingsPanel />
          )}
        </div>
      </div>
    );
  }
);
AppBar.displayName = "AppBar";

export { AppBar };

