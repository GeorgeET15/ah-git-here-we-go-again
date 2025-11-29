/**
 * System Status Bar Component
 * Displays system information in cyberpunk style
 */

import { useEffect, useState } from "react";

interface SystemStatusBarProps {
  position: "top" | "bottom";
  showPulseVisualizer?: boolean;
}

export const SystemStatusBar: React.FC<SystemStatusBarProps> = ({
  position,
  showPulseVisualizer = false,
}) => {
  const [uptime, setUptime] = useState(0);
  const [crisisLevel, setCrisisLevel] = useState(95);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const positionClass = position === "top" ? "top-0" : "bottom-0";

  return (
    <div
      className={`fixed ${positionClass} left-0 right-0 z-40 border-t border-b border-cyan-400/20 bg-black/80 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between px-4 py-2 font-mono text-xs text-cyan-400/80">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-cyan-400/60">SYSTEM:</span>{" "}
            <span className="text-cyan-400">ONLINE</span>
          </div>
          <div>
            <span className="text-cyan-400/60">UPTIME:</span>{" "}
            <span className="text-cyan-400">{formatUptime(uptime)}</span>
          </div>
          <div>
            <span className="text-cyan-400/60">BUILD:</span>{" "}
            <span className="text-cyan-400">v1.0.0</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-red-400/60">CRISIS LEVEL:</span>{" "}
            <span className="text-red-400">{crisisLevel}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-2 w-2 rounded-full bg-red-500"
              style={{
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
                animation: "pulse 1s infinite",
              }}
            />
            <span className="text-red-400">CRITICAL</span>
          </div>
        </div>
      </div>
      {showPulseVisualizer && position === "bottom" && (
        <div className="h-1 bg-gradient-to-r from-cyan-400/20 via-cyan-400/40 to-cyan-400/20">
          <div
            className="h-full bg-cyan-400/60"
            style={{
              width: "100%",
              animation: "pulse 0.5s infinite",
            }}
          />
        </div>
      )}
    </div>
  );
};

