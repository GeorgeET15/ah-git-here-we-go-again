/**
 * Terminal Feed Component
 * Auto-scrolling terminal with rotating messages
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalFeedProps {
  messages: string[];
  playerName?: string;
  rotationInterval?: number; // milliseconds
}

export const TerminalFeed: React.FC<TerminalFeedProps> = ({
  messages,
  playerName = "Engineer",
  rotationInterval = 4000,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayMessages, setDisplayMessages] = useState<string[]>([]);

  useEffect(() => {
    // Replace placeholders in messages
    const processedMessages = messages.map((msg) =>
      msg.replace("{playerName}", playerName)
    );

    // Initialize with first few messages
    setDisplayMessages(processedMessages.slice(0, 5));

    // Rotate messages
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % processedMessages.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [messages, playerName, rotationInterval]);

  useEffect(() => {
    // Add new message to display when index changes
    if (messages.length > 0) {
      const processedMessages = messages.map((msg) =>
        msg.replace("{playerName}", playerName)
      );
      const newMessage = processedMessages[currentMessageIndex];
      
      setDisplayMessages((prev) => {
        const updated = [...prev, newMessage];
        // Keep only last 6 messages
        return updated.slice(-6);
      });
    }
  }, [currentMessageIndex, messages, playerName]);

  return (
    <div className="relative w-full h-48 bg-background/90 border-t-2 border-accent-cyan/30 font-mono text-sm overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--accent-cyan) / 0.1) 2px, hsl(var(--accent-cyan) / 0.1) 4px)`,
          }}
        />
      </div>

      {/* Messages container */}
      <div className="relative h-full p-4 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {displayMessages.map((message, index) => (
            <motion.div
              key={`${message}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="mb-2 text-accent-cyan"
            >
              <span className="text-success">$</span>{" "}
              <span
                className={
                  message.includes("[CRITICAL]")
                    ? "text-error"
                    : message.includes("[WARNING]")
                    ? "text-warning"
                    : message.includes("[AUTH]") || message.includes("[MISSION]")
                    ? "text-accent-cyan"
                    : message.includes("[LOCKED]") || message.includes("[STATUS]")
                    ? "text-muted-foreground"
                    : "text-accent-cyan/80"
                }
              >
                {message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blinking cursor */}
        <motion.span
          className="inline-block w-2 h-4 bg-accent-cyan ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

