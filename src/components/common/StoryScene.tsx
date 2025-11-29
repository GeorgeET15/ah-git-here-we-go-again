import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Terminal as TerminalIcon } from "lucide-react";
import { Panel } from "@/ui/components/Panel";
import { Text, Heading } from "@/ui/components/Typography";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInScale, slideInLeft, fadeInUp } from "@/ui/animation/motionPresets";
import { CharacterPortrait, CharacterType, ExpressionType } from "@/ui/components/characters";

interface Scene {
  speaker: string;
  text: string;
  image?: string;
  type?: "system" | "character";
}

interface StorySceneProps {
  scenes: Scene[];
  onComplete: () => void;
}

export const StoryScene = ({ scenes, onComplete }: StorySceneProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const currentScene = scenes[currentIndex];

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentScene.text);
      setIsTyping(false);
      return;
    }

    if (currentIndex < scenes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  // Keyboard support - Enter to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isTyping, displayedText, currentScene.text, scenes.length, onComplete]);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    const text = currentScene.text;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentIndex, currentScene.text]);

  const getCharacterType = (speaker: string): CharacterType => {
    if (speaker.toLowerCase().includes("keif") || speaker.toLowerCase().includes("keif-x")) {
      return "keif-x";
    }
    if (speaker.toLowerCase().includes("bug") || speaker.toLowerCase().includes("buglord")) {
      return "buglord";
    }
    return "system";
  };

  const getExpression = (speaker: string, text: string): ExpressionType => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("alert") || lowerText.includes("warning") || lowerText.includes("error")) {
      return "warn";
    }
    if (lowerText.includes("!") || lowerText.includes("angry") || lowerText.includes("hah")) {
      return speaker.toLowerCase().includes("bug") ? "angry" : "warn";
    }
    if (lowerText.includes("congratulations") || lowerText.includes("success") || lowerText.includes("🎉")) {
      return "happy";
    }
    return "neutral";
  };

  const characterType = getCharacterType(currentScene.speaker);
  const expression = getExpression(currentScene.speaker, currentScene.text);
  const isSystem = currentScene.type === "system";
  const isBugLord = characterType === "buglord";

  // BugLord gets special full-screen centered treatment - clean and simple
  if (isBugLord) {
    return (
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle red tint background */}
        <div className="absolute inset-0 bg-error/10" />

        {/* Centered BugLord content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 max-w-xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* BugLord Portrait */}
          <div className="scale-125">
            <CharacterPortrait
              character="buglord"
              expression="angry"
              size="lg"
            />
          </div>

          {/* Simple Dialog Text */}
          <div className="text-center">
            <div className="px-6 py-4 bg-card border-2 border-error/30 rounded-lg">
              <Text
                size="lg"
                className="font-semibold text-foreground leading-relaxed"
              >
                {displayedText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-2 h-5 bg-foreground ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </Text>
            </div>
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleNext}
              className="bg-error hover:bg-error/80 text-error-foreground border-2 border-error px-8 py-3 font-bold"
              size="lg"
            >
              {currentIndex < scenes.length - 1 ? "Next" : "Continue"}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Regular dialog layout for Keif-X and system messages
  return (
    <motion.div
      className="flex items-center justify-center min-h-full p-8"
      initial="hidden"
      animate="visible"
      variants={fadeInScale}
    >
      <div className="w-full max-w-5xl flex gap-8 items-center">
        {/* Character Portrait */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideInLeft}
          className="flex-shrink-0"
        >
          {isSystem ? (
            <Panel className="w-64 h-64 flex items-center justify-center">
              <TerminalIcon className="w-24 h-24 text-primary" />
            </Panel>
          ) : (
            <CharacterPortrait
              character={characterType}
              expression={expression}
              size="lg"
            />
          )}
        </motion.div>

        {/* Dialog Bubble */}
        <motion.div
          className="flex-1 space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Panel className="min-h-[200px] relative">
                <div className="mb-4">
                  <Text size="sm" className="font-mono text-primary">
                    {currentScene.speaker}
                  </Text>
                </div>
                <Text size="lg" className="leading-relaxed">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      className="inline-block w-2 h-5 bg-primary ml-1"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </Text>
              </Panel>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleNext}
              className="github-btn px-6 py-2"
            >
              {currentIndex < scenes.length - 1 ? "Next" : "Continue"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
