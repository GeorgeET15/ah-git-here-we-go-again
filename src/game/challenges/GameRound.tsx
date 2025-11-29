/**
 * Game Round Component
 * Challenge mode where players solve Git problems for points
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "@/ui/layout";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { TerminalWindow } from "@/ui/components/TerminalWindow";
import { GuidedTerminal } from "@/components/terminal/GuidedTerminal";
import { Button } from "@/components/ui/button";
import { GitChallenge, ChallengeResult } from "./types";
import { getRandomChallenges } from "@/data/challenges/challengePool";
import { useGameStore } from "@/game/state/selectors";
import { Clock, Lightbulb, Trophy, AlertCircle, Home, Play, Gamepad2 } from "lucide-react";
import { fadeInUp, scaleIn } from "@/ui/animation/motionPresets";
import { confetti } from "@/ui/animation/bossEffects";

interface GameRoundProps {
  onComplete: (finalScore: number, results: ChallengeResult[]) => void;
  onExit?: () => void;
}

export const GameRound: React.FC<GameRoundProps> = ({ onComplete, onExit }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [challenges, setChallenges] = useState<GitChallenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [results, setResults] = useState<ChallengeResult[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [showSuccess, setShowSuccess] = useState(false);
  const { addTerminalLine, clearTerminal } = useGameStore();
  const attemptsRef = useRef(0);

  const currentChallenge = challenges[currentChallengeIndex];
  const totalChallenges = challenges.length;

  const finishGame = useCallback(() => {
    const totalTime = Date.now() - startTime;
    onComplete(score, results);
  }, [score, results, startTime, onComplete]);

  const loadChallenge = useCallback((challenge: GitChallenge, index: number) => {
    setTimeRemaining(challenge.maxTime);
    setHintsUsed([]);
    setAttempts(0);
    attemptsRef.current = 0;
    setShowSuccess(false);
    clearTerminal();
    
    // Show challenge context
    if (challenge.visualContext?.terminalOutput) {
      challenge.visualContext.terminalOutput.forEach(line => {
        addTerminalLine({ type: "output", text: line });
      });
    }
    
    addTerminalLine({ type: "output", text: "" });
    addTerminalLine({ type: "info", text: `Challenge ${index + 1}/${totalChallenges}: ${challenge.scenario}` });
  }, [clearTerminal, addTerminalLine, totalChallenges]);

  const moveToNextChallenge = useCallback(() => {
    if (currentChallengeIndex < totalChallenges - 1) {
      const nextIndex = currentChallengeIndex + 1;
      setCurrentChallengeIndex(nextIndex);
      loadChallenge(challenges[nextIndex], nextIndex);
    } else {
      // All challenges complete
      finishGame();
    }
  }, [currentChallengeIndex, totalChallenges, challenges, loadChallenge, finishGame]);

  // Initialize challenges
  useEffect(() => {
    const selectedChallenges = getRandomChallenges(10); // 10 challenges per round
    setChallenges(selectedChallenges);
    // Don't start automatically - wait for user to click Start
  }, []);

  const handleStartGame = () => {
    setShowIntro(false);
    setStartTime(Date.now());
    if (challenges.length > 0) {
      loadChallenge(challenges[0], 0);
    }
  };

  const handleTimeUp = useCallback(() => {
    if (!currentChallenge) return;
    
    addTerminalLine({ type: "error", text: "⏱️ Time's up! Moving to next challenge..." });
    
    const result: ChallengeResult = {
      challengeId: currentChallenge.id,
      completed: false,
      score: 0,
      timeTaken: currentChallenge.maxTime,
      hintsUsed: [],
      attempts: attemptsRef.current,
      completedAt: Date.now(),
    };
    
    setResults(prev => [...prev, result]);
    moveToNextChallenge();
  }, [currentChallenge, addTerminalLine, moveToNextChallenge]);

  // Timer effect
  useEffect(() => {
    if (!currentChallenge || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentChallenge, timeRemaining, handleTimeUp]);

  const validateCommand = (command: string, challenge: GitChallenge): boolean => {
    const trimmed = command.trim();
    
    // Check main command pattern
    if (typeof challenge.commandPattern === "string") {
      const regex = new RegExp(challenge.commandPattern);
      if (regex.test(trimmed)) return true;
    } else if (challenge.commandPattern instanceof RegExp) {
      if (challenge.commandPattern.test(trimmed)) return true;
    }
    
    // Check alternative commands
    if (challenge.alternativeCommands) {
      return challenge.alternativeCommands.some(alt => 
        trimmed === alt || trimmed.includes(alt)
      );
    }
    
    return false;
  };

  const handleCommand = useCallback((command: string) => {
    if (!currentChallenge || showSuccess) return;
    
    attemptsRef.current += 1;
    setAttempts(attemptsRef.current);
    addTerminalLine({ type: "command", text: command });
    
    const isCorrect = validateCommand(command, currentChallenge);
    
    if (isCorrect) {
      // Calculate points
      const timeBonus = Math.max(0, timeRemaining * currentChallenge.timeBonus);
      const hintPenalty = hintsUsed.reduce((sum, level) => {
        const hint = currentChallenge.hints.find(h => h.level === level);
        return sum + (hint?.cost || 0);
      }, 0);
      
      const points = currentChallenge.basePoints + timeBonus - hintPenalty;
      const newScore = score + points;
      setScore(newScore);
      
      // Show success
      addTerminalLine({ type: "success", text: `✅ ${currentChallenge.successMessage}` });
      addTerminalLine({ type: "output", text: `💡 ${currentChallenge.explanation}` });
      addTerminalLine({ type: "success", text: `🎉 +${points} points! (Base: ${currentChallenge.basePoints}, Time: +${timeBonus}, Hints: -${hintPenalty})` });
      
      setShowSuccess(true);
      
      // Save result
      const result: ChallengeResult = {
        challengeId: currentChallenge.id,
        completed: true,
        score: points,
        timeTaken: currentChallenge.maxTime - timeRemaining,
        hintsUsed: [...hintsUsed],
        attempts: attemptsRef.current,
        completedAt: Date.now(),
      };
      
      setResults(prev => [...prev, result]);
      
      // Move to next challenge after delay
      setTimeout(() => {
        moveToNextChallenge();
      }, 2500);
    } else {
      addTerminalLine({ type: "error", text: "❌ That's not the right command. Try again!" });
    }
  }, [currentChallenge, timeRemaining, hintsUsed, score, attempts, showSuccess, addTerminalLine, moveToNextChallenge]);

  const handleHint = (level: 1 | 2 | 3) => {
    if (!currentChallenge) return;
    if (hintsUsed.includes(level)) return; // Already used
    
    const hint = currentChallenge.hints.find(h => h.level === level);
    if (hint) {
      setHintsUsed(prev => [...prev, level]);
      setScore(prev => Math.max(0, prev - hint.cost));
      addTerminalLine({ type: "info", text: `💡 Hint (Level ${level}, -${hint.cost} pts): ${hint.text}` });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (challenges.length === 0) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <Text>Loading challenges...</Text>
        </div>
      </AppShell>
    );
  }

  // Show intro screen
  if (showIntro) {
    return (
      <AppShell appBarProps={{ title: "Game Round", showCommandReference: false }}>
        <motion.div
          className="h-full"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-6xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Gamepad2 className="w-8 h-8 text-success" />
                </div>
                <div>
                  <Heading level={1}>Game Round</Heading>
                  <Text variant="muted" size="lg">Test your Git skills with dynamic challenges!</Text>
                </div>
              </div>
              {onExit && (
                <Button variant="outline" size="lg" onClick={onExit}>
                  <Home className="w-5 h-5 mr-2" />
                  Home
                </Button>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                <Panel>
                  <PanelHeader>
                    <Heading level={3}>What is Game Round?</Heading>
                  </PanelHeader>
                  <PanelContent>
                    <Text>
                      Game Round is a challenge mode where you'll face 10 dynamic Git problems. 
                      Each challenge presents a scenario with a bug or issue that you need to fix 
                      using the correct Git command. Test your knowledge, earn points, and see how 
                      well you know Git!
                    </Text>
                  </PanelContent>
                </Panel>

                <Panel>
                  <PanelHeader>
                    <Heading level={3}>How to Play</Heading>
                  </PanelHeader>
                  <PanelContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Text size="md" weight="bold" className="text-primary">1</Text>
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Read the Challenge</Text>
                          <Text variant="muted">
                            Each challenge shows a scenario and a problem that needs fixing.
                          </Text>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Text size="md" weight="bold" className="text-primary">2</Text>
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Type the Correct Command</Text>
                          <Text variant="muted">
                            Enter the Git command that solves the problem in the terminal.
                          </Text>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Text size="md" weight="bold" className="text-primary">3</Text>
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Earn Points</Text>
                          <Text variant="muted">
                            Get points for correct answers. Faster answers = more points!
                          </Text>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Text size="md" weight="bold" className="text-primary">4</Text>
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Use Hints (Optional)</Text>
                          <Text variant="muted">
                            Need help? Use hints, but they cost points. Use them wisely!
                          </Text>
                        </div>
                      </div>
                    </div>
                  </PanelContent>
                </Panel>
              </div>

              {/* Right Column */}
              <div className="space-y-8">

                <Panel>
                  <PanelHeader>
                    <Heading level={3}>Rules & Scoring</Heading>
                  </PanelHeader>
                  <PanelContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-warning/10">
                          <Trophy className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Base Points</Text>
                          <Text variant="muted">
                            Each challenge has a base point value. Get it right, earn the base points.
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Time Bonus</Text>
                          <Text variant="muted">
                            The faster you solve it, the more bonus points you get. Time is money!
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-warning/10">
                          <Lightbulb className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Hint Penalty</Text>
                          <Text variant="muted">
                            Each hint costs points. Level 1 hints cost less, higher levels cost more.
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-error/10">
                          <AlertCircle className="w-6 h-6 text-error" />
                        </div>
                        <div>
                          <Text weight="semibold" size="lg">Mistakes</Text>
                          <Text variant="muted">
                            Wrong answers don't cost points, but you lose time. Try again until you get it right!
                          </Text>
                        </div>
                      </div>
                    </div>
                  </PanelContent>
                </Panel>

                <Panel>
                  <PanelHeader>
                    <Heading level={3}>Tips for Success</Heading>
                  </PanelHeader>
                  <PanelContent>
                    <ul className="space-y-3 list-disc list-inside">
                      <li><Text>Read the scenario carefully - context matters!</Text></li>
                      <li><Text>Check the terminal output to understand the current state</Text></li>
                      <li><Text>Think about what Git command would fix the problem</Text></li>
                      <li><Text>Use hints only when really stuck - they reduce your score</Text></li>
                      <li><Text>Speed matters! Quick correct answers earn more points</Text></li>
                    </ul>
                  </PanelContent>
                </Panel>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleStartGame}
                size="lg"
                className="flex-1 h-14 text-lg"
              >
                <Play className="w-6 h-6 mr-2" />
                Start Game Round
              </Button>
              {onExit && (
                <Button
                  onClick={onExit}
                  variant="outline"
                  size="lg"
                  className="h-14"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AppShell>
    );
  }

  if (!currentChallenge) {
    return null;
  }

  return (
    <AppShell appBarProps={{ title: "Game Round", showCommandReference: false }}>
      <motion.div
        className="h-[calc(100vh-56px)] flex flex-col space-y-3 overflow-hidden"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Progress - Compact */}
        <div className="flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <Heading level={3}>
                Challenge {currentChallengeIndex + 1}/{totalChallenges}
              </Heading>
              <Text variant="muted" size="xs">
                {currentChallenge.difficulty.toUpperCase()} • {currentChallenge.category}
              </Text>
            </div>
            {onExit && (
              <Button variant="outline" size="sm" onClick={onExit}>
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-4 h-4" />
                <Text size="md" weight="bold">{score}</Text>
              </div>
              <Text size="xs" variant="muted">Points</Text>
            </div>
            <motion.div
              className={`text-right ${timeRemaining <= 10 ? "text-error" : ""}`}
              animate={timeRemaining <= 10 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Text size="md" weight="bold">{formatTime(timeRemaining)}</Text>
              </div>
              <Text size="xs" variant="muted">Time Left</Text>
            </motion.div>
          </div>
        </div>

        {/* Main Content Area - Grid Layout */}
        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Left Column */}
          <div className="flex flex-col gap-3 min-h-0">
            {/* Challenge Description - Compact */}
            <Panel className="flex-shrink-0">
              <PanelHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <Text weight="semibold" size="sm">Scenario</Text>
                </div>
              </PanelHeader>
              <PanelContent className="space-y-2">
                <Text size="sm">{currentChallenge.scenario}</Text>
                <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
                  <Text variant="error" weight="semibold" size="sm" className="mb-1">⚠️ Problem:</Text>
                  <Text variant="error" size="sm">{currentChallenge.bugDescription}</Text>
                </div>
              </PanelContent>
            </Panel>

            {/* Visual Context - Compact */}
            {currentChallenge.visualContext?.terminalOutput && (
              <Panel className="flex-1 min-h-0 flex flex-col">
                <PanelHeader>
                  <Text weight="semibold" size="sm">Current State</Text>
                </PanelHeader>
                <PanelContent className="flex-1 min-h-0 overflow-hidden">
                  <div className="h-full overflow-y-auto font-mono text-xs space-y-1 p-2 bg-editor rounded">
                    {currentChallenge.visualContext.terminalOutput.map((line, i) => (
                      <div key={i} className="text-foreground">{line}</div>
                    ))}
                  </div>
                </PanelContent>
              </Panel>
            )}

            {/* Hints - Compact */}
            <Panel className="flex-shrink-0">
              <PanelHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  <Text weight="semibold" size="sm">Hints (Costs Points)</Text>
                </div>
              </PanelHeader>
              <PanelContent>
                <div className="flex flex-wrap gap-2">
                  {currentChallenge.hints.map((hint, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => handleHint(hint.level)}
                      disabled={hintsUsed.includes(hint.level) || showSuccess}
                      className="flex items-center gap-1"
                    >
                      <Lightbulb className="w-3 h-3" />
                      Hint {hint.level}
                      {hintsUsed.includes(hint.level) ? (
                        <span className="text-xs text-muted-foreground">(Used)</span>
                      ) : (
                        <span className="text-xs text-error">(-{hint.cost})</span>
                      )}
                    </Button>
                  ))}
                </div>
                {hintsUsed.length > 0 && (
                  <Text size="xs" variant="muted" className="mt-2">
                    Total penalty: -{hintsUsed.reduce((sum, level) => {
                      const hint = currentChallenge.hints.find(h => h.level === level);
                      return sum + (hint?.cost || 0);
                    }, 0)} pts
                  </Text>
                )}
              </PanelContent>
            </Panel>
          </div>

          {/* Right Column - Terminal */}
          <Panel className="flex-1 min-h-0 flex flex-col">
            <PanelHeader>
              <Text weight="semibold" size="sm">Enter Git Command</Text>
            </PanelHeader>
            <PanelContent className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full">
                <GuidedTerminal
                  onCommand={handleCommand}
                  suggestions={[]} // No suggestions in game mode!
                  useGlobalStore={true}
                />
              </div>
            </PanelContent>
          </Panel>
        </div>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
              variants={confetti.container}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                variants={scaleIn}
                className="text-center"
              >
                <Text size="2xl" weight="bold" className="text-success mb-4">
                  ✅ Correct!
                </Text>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppShell>
  );
};

