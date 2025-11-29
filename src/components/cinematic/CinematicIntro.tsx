/**
 * Cinematic Intro Component
 * Scene 0: Full-screen cinematic opening sequence
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GlitchOverlay } from "./GlitchOverlay";
import { ScreenShake } from "./ScreenShake";
import { ParticleSystem } from "./ParticleSystem";
import { useSound } from "@/audio/sounds";
import { Button } from "@/components/ui/button";
import { SkipForward } from "lucide-react";

interface CinematicIntroProps {
  onComplete: () => void;
  playerName?: string;
}

type ScenePhase =
  | "black-screen"
  | "system-alert"
  | "code-city"
  | "terminal-chaos"
  | "keif-hologram"
  | "name-reveal"
  | "terminal-boot"
  | "transition";

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  playerName = "Engineer",
}) => {
  const [phase, setPhase] = useState<ScenePhase>("black-screen");

  // Update ref when phase changes
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  const [glitchEnabled, setGlitchEnabled] = useState(true);
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [keifAutoAdvanceTimer, setKeifAutoAdvanceTimer] =
    useState<NodeJS.Timeout | null>(null);
  const [nameRevealTimer, setNameRevealTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const hasStartedRef = useRef(false);
  const phaseRef = useRef<ScenePhase>("black-screen");

  // Memoize onComplete to prevent effect re-runs
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleComplete = useCallback(() => {
    if (!isSkipping) {
      onCompleteRef.current();
    }
  }, [isSkipping]);

  // Keyboard support - Enter to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Only trigger if we're on a phase with a continue button
        if (phase === "system-ready" || phase === "keif-x-hologram" || phase === "keif-x-final") {
          if (phase === "system-ready") {
            setPhase("transition");
            setGlitchEnabled(false);
            setTimeout(() => {
              handleComplete();
            }, 1000);
          } else {
            handleComplete();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, handleComplete]);

  // Phase transitions - only run once
  useEffect(() => {
    // Prevent multiple runs
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    const timers: NodeJS.Timeout[] = [];

    // Black screen (0-2s) - brief pause
    timers.push(
      setTimeout(() => {
        setPhase("system-alert");
        setShakeEnabled(true);
        setAlarmEnabled(true);
        try {
          useSound("failure")();
        } catch (e) {
          // Ignore sound errors
        }
      }, 2000)
    );

    // System alert (2-8s) - 6 seconds to read the alert messages
    timers.push(
      setTimeout(() => {
        setPhase("code-city");
        try {
          useSound("conflict")();
        } catch (e) {
          // Ignore sound errors
        }
      }, 8000)
    );

    // Code city (8-16s) - 8 seconds to see the code city visualization
    timers.push(
      setTimeout(() => {
        setPhase("terminal-chaos");
      }, 16000)
    );

    // Terminal chaos (16-26s) - 10 seconds to read the terminal errors
    timers.push(
      setTimeout(() => {
        setPhase("keif-hologram");
        setParticlesEnabled(true);
        try {
          useSound("notification")();
        } catch (e) {
          // Ignore sound errors
        }
        // Auto-advance after 12 seconds if user doesn't click - more time to read
        const autoAdvance = setTimeout(() => {
          setPhase("name-reveal");
          setParticlesEnabled(false);
          // After name reveal, auto-advance to terminal-boot after 10 seconds
          const nameTimer = setTimeout(() => {
            if (phaseRef.current === "name-reveal") {
              setPhase("terminal-boot");
              setShakeEnabled(false);
              setAlarmEnabled(false);
              try {
                useSound("success")();
              } catch (e) {
                // Ignore sound errors
              }
            }
          }, 10000);
          setNameRevealTimer(nameTimer);
          timers.push(nameTimer);
        }, 12000);
        setKeifAutoAdvanceTimer(autoAdvance);
        timers.push(autoAdvance); // Add to cleanup array
      }, 26000)
    );

    // Terminal boot transition to fade out - 10 seconds after name reveal
    // This is handled by the Continue button or auto-advance timer
    // Fallback: if we're still in terminal-boot after 20 seconds, transition
    timers.push(
      setTimeout(() => {
        if (phaseRef.current === "terminal-boot") {
          setPhase("transition");
          setGlitchEnabled(false);
        }
      }, 68000) // 26s keif + 12s auto + 10s name + 20s terminal = 68s
    );

    // Transition fade out - 4 seconds
    timers.push(
      setTimeout(() => {
        handleComplete();
      }, 72000) // 68s + 4s = 72s
    );

    return () => {
      timers.forEach(clearTimeout);
      if (keifAutoAdvanceTimer) {
        clearTimeout(keifAutoAdvanceTimer);
      }
      if (nameRevealTimer) {
        clearTimeout(nameRevealTimer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Handle skip
  const handleSkip = useCallback(() => {
    setIsSkipping(true);
    handleComplete();
  }, [handleComplete]);

  const cinematicContent = (
    <div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Skip Button */}
      <div className="absolute top-4 right-4 z-[60]">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSkip}
          className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip Intro
        </Button>
      </div>

      <GlitchOverlay enabled={glitchEnabled} intensity={0.6} frequency={200}>
        <ScreenShake
          enabled={shakeEnabled}
          intensity={phase === "system-alert" ? 1 : 0.5}
        >
          <div
            className="relative h-full w-full"
            style={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Black Screen */}
            <AnimatePresence mode="wait">
              {phase === "black-screen" && (
                <motion.div
                  key="black"
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              {/* System Alert */}
              {phase === "system-alert" && (
                <motion.div
                  key="alert"
                  className="absolute inset-0 flex items-center justify-center bg-black"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center space-y-6 px-4">
                    <motion.div
                      className="text-red-500 font-mono text-3xl md:text-4xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      ⚠️ ALERT. Critical infrastructure failure.
                    </motion.div>
                    <motion.div
                      className="text-red-400 font-mono text-2xl md:text-3xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.2,
                      }}
                    >
                      Ah Git… here we go again.
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Code City Visualization */}
              {phase === "code-city" && (
                <motion.div
                  key="city"
                  className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-black flex items-center justify-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2 }}
                >
                  <div className="text-center space-y-8 px-4">
                    <div className="font-mono text-cyan-400 text-5xl md:text-6xl">
                      {`{`}
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        CODE CITY
                      </motion.span>
                      {`}`}
                    </div>
                    <div className="text-red-400 text-xl md:text-2xl">
                      Buildings crumbling... Systems failing...
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Terminal Chaos */}
              {phase === "terminal-chaos" && (
                <motion.div
                  key="chaos"
                  className="absolute inset-0 bg-black p-8 flex flex-col items-center justify-center"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-2 gap-4 flex-1 max-h-[60vh] w-full">
                    <div className="font-mono text-red-500 text-xs overflow-hidden">
                      <motion.div
                        animate={{ y: [0, -100] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {Array.from({ length: 20 }, (_, i) => (
                          <div key={i}>
                            ERROR: Stack trace at line {i * 100}
                          </div>
                        ))}
                      </motion.div>
                    </div>
                    <div className="font-mono text-yellow-500 text-xs overflow-hidden">
                      <motion.div
                        animate={{ y: [0, -100] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {Array.from({ length: 20 }, (_, i) => (
                          <div key={i}>WARNING: Deployment failed {i}</div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                  <div className="text-center font-mono text-red-400 text-lg md:text-xl py-4 mt-4">
                    All commits lost. History corrupted. No backups detected.
                  </div>
                </motion.div>
              )}

              {/* Keif-X Hologram */}
              {phase === "keif-hologram" && (
                <motion.div
                  key="keif"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 overflow-hidden z-[55]"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 55,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="text-center flex flex-col items-center justify-center space-y-5 max-w-3xl px-4 relative z-[56]"
                    style={{ zIndex: 56 }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    {/* Keif Logo */}
                    <motion.img
                      src="/keif-logo-d.png"
                      alt="Keif-X"
                      className="w-32 h-32 md:w-40 md:h-40 mb-4"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      style={{
                        filter: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))",
                      }}
                    />
                    <div className="text-cyan-400 text-4xl md:text-5xl font-bold drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                      KEIF-X
                    </div>
                    <motion.div
                      className="text-cyan-300 text-lg md:text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      We still have a chance.
                    </motion.div>
                    <motion.div
                      className="text-cyan-300 text-lg md:text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      A new engineer has arrived.
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="mt-2 relative z-[60]"
                      style={{ zIndex: 60, position: "relative" }}
                    >
                      <Button
                        onClick={() => {
                          // Clear auto-advance timer
                          if (keifAutoAdvanceTimer) {
                            clearTimeout(keifAutoAdvanceTimer);
                            setKeifAutoAdvanceTimer(null);
                          }
                          // Clear name reveal auto-advance timer if it exists
                          if (nameRevealTimer) {
                            clearTimeout(nameRevealTimer);
                            setNameRevealTimer(null);
                          }
                          // Manually advance to next phase
                          setPhase("name-reveal");
                          setParticlesEnabled(false);
                          // Set up manual advance for name-reveal to terminal-boot
                          const nameTimer = setTimeout(() => {
                            if (phaseRef.current === "name-reveal") {
                              setPhase("terminal-boot");
                              setShakeEnabled(false);
                              setAlarmEnabled(false);
                              try {
                                useSound("success")();
                              } catch (e) {
                                // Ignore sound errors
                              }
                            }
                          }, 10000);
                          setNameRevealTimer(nameTimer);
                        }}
                        className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 px-8 py-3 text-base cursor-pointer relative z-[60]"
                        style={{ zIndex: 60, position: "relative", cursor: "pointer" }}
                      >
                        Continue
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              {/* Name Reveal */}
              {phase === "name-reveal" && (
                <motion.div
                  key="name"
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black px-4 z-[55]"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 55,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="font-mono text-green-400 text-5xl md:text-6xl mb-6"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                  >
                    {playerName}
                  </motion.div>
                  <motion.div
                    className="text-cyan-300 text-lg md:text-xl text-center px-4 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    To stabilize the system, we must restore controlled history.
                    <br />
                    We start from zero. This is Git — the power to rewrite time.
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    className="mt-6 relative z-[60]"
                    style={{ zIndex: 60, position: "relative" }}
                  >
                    <Button
                      onClick={() => {
                        // Clear name reveal auto-advance timer
                        if (nameRevealTimer) {
                          clearTimeout(nameRevealTimer);
                          setNameRevealTimer(null);
                        }
                        // Manually advance to terminal-boot
                        setPhase("terminal-boot");
                        setShakeEnabled(false);
                        setAlarmEnabled(false);
                        try {
                          useSound("success")();
                        } catch (e) {
                          // Ignore sound errors
                        }
                      }}
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 px-8 py-3 text-base cursor-pointer relative z-[60]"
                      style={{ zIndex: 60, position: "relative", cursor: "pointer" }}
                    >
                      Continue
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Terminal Boot */}
              {phase === "terminal-boot" && (
                <motion.div
                  key="boot"
                  className="absolute inset-0 bg-black p-8 font-mono text-green-400 flex flex-col items-center justify-center z-[55]"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 55,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-4 text-center px-4">
                    <motion.div
                      className="text-lg md:text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      [SYSTEM] Initializing Git Engine...
                    </motion.div>
                    <motion.div
                      className="text-lg md:text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      [SYSTEM] Loading repository framework...
                    </motion.div>
                    <motion.div
                      className="text-lg md:text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      [SYSTEM] Ready.
                    </motion.div>
                    <motion.div
                      className="mt-4 text-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      <span className="animate-pulse">_</span>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="mt-8 relative z-[60]"
                    style={{ zIndex: 60, position: "relative" }}
                  >
                    <Button
                      onClick={() => {
                        setPhase("transition");
                        setGlitchEnabled(false);
                        // Auto-complete after transition fade
                        setTimeout(() => {
                          handleComplete();
                        }, 1000);
                      }}
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 px-8 py-3 text-base cursor-pointer relative z-[60]"
                      style={{ zIndex: 60, position: "relative", cursor: "pointer" }}
                    >
                      Continue
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Transition */}
              {phase === "transition" && (
                <motion.div
                  key="transition"
                  className="absolute inset-0 bg-black"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              )}
            </AnimatePresence>

            {/* Particles */}
            <ParticleSystem
              enabled={particlesEnabled}
              count={50}
              color="hsl(187, 100%, 50%)"
              origin={{ x: 0.5, y: 0.5 }}
            />

            {/* Alarm Border */}
            {alarmEnabled && (
              <motion.div
                className="absolute inset-0 border-4 border-red-500 pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(239, 68, 68, 0)",
                    "0 0 30px rgba(239, 68, 68, 0.8)",
                    "0 0 0px rgba(239, 68, 68, 0)",
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            )}
          </div>
        </ScreenShake>
      </GlitchOverlay>
    </div>
  );

  // Use portal to render directly to document.body, escaping any parent layout constraints
  if (typeof document !== "undefined") {
    return createPortal(cinematicContent, document.body);
  }

  return cinematicContent;
};
