/**
 * Boss Battle Controller
 * Orchestrates the chaos merge boss battle
 */

import React, { useState, useEffect, useCallback } from "react";
import { conflictSystem, ConflictFile } from "@/game/logic/conflictSystem";
import { timerSystem } from "@/game/state/timer";
import { motion } from "framer-motion";
import { screenShake, alarmBorder, countdownPulse } from "@/ui/animation/bossEffects";
import { BugLordInterrupt } from "./BugLordInterrupt";

interface BossBattleControllerProps {
  bossData: any;
  onVictory: () => void;
  onDefeat: () => void;
}

export const BossBattleController: React.FC<BossBattleControllerProps> = ({
  bossData,
  onVictory,
  onDefeat,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(bossData.timeLimit);
  const [interruptMessage, setInterruptMessage] = useState<string | null>(null);
  const [showInterrupt, setShowInterrupt] = useState(false);
  const [shake, setShake] = useState(false);
  const [lastInterruptTime, setLastInterruptTime] = useState(0);

  // Load conflict data
  useEffect(() => {
    conflictSystem.loadBossData(bossData);
  }, [bossData]);

  // Timer setup
  useEffect(() => {
    timerSystem.start(bossData.timeLimit);

    const unsubscribe = timerSystem.onTick((time) => {
      setTimeRemaining(time);
      
      // Check for time-based interrupts
      const interrupts = bossData.bugLordInterrupts.filter(
        (i: any) => i.trigger === "timeRemaining" && i.threshold && time <= i.threshold && time > i.threshold - 1
      );
      
      if (interrupts.length > 0 && Date.now() - lastInterruptTime > 5000) {
        triggerInterrupt(interrupts[0].message);
      }
    });

    const expireUnsubscribe = timerSystem.onExpire(() => {
      onDefeat();
    });

    return () => {
      unsubscribe();
      expireUnsubscribe();
      timerSystem.stop();
    };
  }, [bossData, lastInterruptTime, onDefeat]);

  const triggerInterrupt = useCallback((message: string) => {
    setInterruptMessage(message);
    setShowInterrupt(true);
    setLastInterruptTime(Date.now());
  }, []);

  const handleInterruptComplete = useCallback(() => {
    setShowInterrupt(false);
    setInterruptMessage(null);
  }, []);

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleMistake = useCallback(() => {
    triggerShake();
    timerSystem.addPenalty(10);
    
    const mistakeInterrupt = bossData.bugLordInterrupts.find(
      (i: any) => i.trigger === "mistake"
    );
    if (mistakeInterrupt && Date.now() - lastInterruptTime > 3000) {
      triggerInterrupt(mistakeInterrupt.message);
    }
  }, [bossData, lastInterruptTime, triggerInterrupt, triggerShake]);

  const handleConflictResolved = useCallback(() => {
    const progress = conflictSystem.getProgress();
    
    if (progress.filesResolved > 0) {
      const interrupt = bossData.bugLordInterrupts.find(
        (i: any) => i.trigger === "conflictResolved" && i.threshold === progress.filesResolved
      );
      if (interrupt && Date.now() - lastInterruptTime > 3000) {
        triggerInterrupt(interrupt.message);
      }
    }
  }, [bossData, lastInterruptTime, triggerInterrupt]);

  return {
    timeRemaining,
    shake,
    triggerShake,
    handleMistake,
    handleConflictResolved,
    interruptMessage,
    showInterrupt,
    handleInterruptComplete,
  };
};

