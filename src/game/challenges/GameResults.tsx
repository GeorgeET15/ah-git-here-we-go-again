/**
 * Game Results Screen
 * Shows final score and statistics after Game Round
 */

import React from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/ui/layout";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Heading, Text } from "@/ui/components/Typography";
import { Button } from "@/components/ui/button";
import { ChallengeResult } from "./types";
import { Trophy, RotateCcw, Home, Star } from "lucide-react";
import { fadeInUp, scaleIn } from "@/ui/animation/motionPresets";
import { confetti } from "@/ui/animation/bossEffects";

interface GameResultsProps {
  finalScore: number;
  results: ChallengeResult[];
  onReplay: () => void;
  onHome: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  finalScore,
  results,
  onReplay,
  onHome,
}) => {
  const challengesCompleted = results.filter(r => r.completed).length;
  const totalChallenges = results.length;
  const totalTime = results.reduce((sum, r) => sum + r.timeTaken, 0);
  const totalAttempts = results.reduce((sum, r) => sum + r.attempts, 0);
  const hintsUsed = results.reduce((sum, r) => sum + r.hintsUsed.length, 0);
  
  // Calculate rating (stars)
  const completionRate = challengesCompleted / totalChallenges;
  let stars = 1;
  if (completionRate >= 0.9 && finalScore >= 2000) stars = 3;
  else if (completionRate >= 0.7 && finalScore >= 1500) stars = 2;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AppShell>
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen p-8"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-3xl space-y-8">
          {/* Success Animation */}
          <motion.div
            className="text-center"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="w-20 h-20 text-warning mx-auto" />
            </motion.div>
            
            <Heading level={1} className="text-4xl md:text-5xl mb-2">
              Game Round Complete!
            </Heading>
            
            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= stars
                      ? "text-warning fill-warning"
                      : "text-muted fill-muted"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Final Score */}
          <motion.div
            className="text-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl md:text-7xl font-bold text-primary mb-2">
              {finalScore.toLocaleString()}
            </div>
            <Text size="lg" variant="muted">Total Points</Text>
          </motion.div>

          {/* Statistics */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <Panel>
              <PanelHeader>
                <Text weight="semibold">Statistics</Text>
              </PanelHeader>
              <PanelContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {challengesCompleted}/{totalChallenges}
                    </div>
                    <Text size="sm" variant="muted">Challenges</Text>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-1">
                      {Math.round((challengesCompleted / totalChallenges) * 100)}%
                    </div>
                    <Text size="sm" variant="muted">Success Rate</Text>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatTime(totalTime)}
                    </div>
                    <Text size="sm" variant="muted">Total Time</Text>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-1">
                      {hintsUsed}
                    </div>
                    <Text size="sm" variant="muted">Hints Used</Text>
                  </div>
                </div>
              </PanelContent>
            </Panel>
          </motion.div>

          {/* Challenge Breakdown */}
          {results.length > 0 && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <Panel>
                <PanelHeader>
                  <Text weight="semibold">Challenge Breakdown</Text>
                </PanelHeader>
                <PanelContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {results.map((result, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          result.completed
                            ? "bg-success/10 border-success/30"
                            : "bg-error/10 border-error/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            result.completed ? "bg-success" : "bg-error"
                          }`}></div>
                          <div>
                            <Text weight="semibold" size="sm">
                              Challenge {i + 1}
                            </Text>
                            <Text size="xs" variant="muted">
                              {result.completed ? "Completed" : "Failed"} • {result.attempts} attempts
                            </Text>
                          </div>
                        </div>
                        <div className="text-right">
                          <Text weight="bold" className={result.completed ? "text-success" : "text-error"}>
                            {result.completed ? `+${result.score}` : "0"}
                          </Text>
                          <Text size="xs" variant="muted">
                            {formatTime(result.timeTaken)}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </PanelContent>
              </Panel>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={onReplay}
              className="github-btn"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            
            <Button
              onClick={onHome}
              variant="outline"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
};

