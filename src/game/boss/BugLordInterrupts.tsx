/**
 * BugLord Interrupts Component
 * Character interruptions during boss battle
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bugLordCutIn } from "@/ui/animation/bossEffects";
import { CharacterPortrait } from "@/ui/components/characters";
import { Panel } from "@/ui/components/Panel";
import { Text } from "@/ui/components/Typography";

interface BugLordInterruptProps {
  message: string;
  show: boolean;
  onComplete: () => void;
}

export const BugLordInterrupt: React.FC<BugLordInterruptProps> = ({
  message,
  show,
  onComplete,
}) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
          variants={bugLordCutIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Panel className="max-w-md p-8">
            <div className="flex flex-col items-center gap-4">
              <CharacterPortrait
                character="buglord"
                expression="angry"
                size="lg"
              />
              <Text size="lg" className="text-center font-semibold">
                {message}
              </Text>
            </div>
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

