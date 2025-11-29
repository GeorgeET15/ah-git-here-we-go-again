import { useEffect, useState } from "react";
import { Check, X, Info } from "lucide-react";

interface TerminalProps {
  messages: TerminalMessage[];
}

export interface TerminalMessage {
  type: "info" | "success" | "error";
  text: string;
}

export const Terminal = ({ messages }: TerminalProps) => {
  const [visibleMessages, setVisibleMessages] = useState<TerminalMessage[]>([]);

  useEffect(() => {
    setVisibleMessages(messages.slice(-5));
  }, [messages]);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4 text-success" />;
      case "error":
        return <X className="w-4 h-4 text-error" />;
      default:
        return <Info className="w-4 h-4 text-terminal-text" />;
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-success";
      case "error":
        return "text-error";
      default:
        return "text-terminal-text";
    }
  };

  return (
    <div className="terminal-panel p-4 h-32 overflow-y-auto font-mono text-sm">
      <div className="space-y-2">
        {visibleMessages.map((msg, idx) => (
          <div key={idx} className="flex items-start gap-2 animate-fade-in">
            {getIcon(msg.type)}
            <span className={getTextColor(msg.type)}>{msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
