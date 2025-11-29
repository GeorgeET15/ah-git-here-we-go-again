/**
 * Multi-File Conflict Editor
 * Handles multiple concurrent conflict files with tab navigation
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Button } from "@/components/ui/button";
import { Text } from "@/ui/components/Typography";
import { ConflictFile, Conflict } from "@/game/logic/conflictSystem";
import { ConflictFileTab } from "./ConflictFileTab";
import { fadeInUp } from "@/ui/animation/motionPresets";

interface MultiFileConflictEditorProps {
  files: ConflictFile[];
  onResolve: (filename: string, conflictId: string, resolution: "current" | "incoming" | "both") => void;
  onAllResolved?: () => void;
}

export const MultiFileConflictEditor: React.FC<MultiFileConflictEditorProps> = ({
  files,
  onResolve,
  onAllResolved,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const activeFile = files[activeFileIndex];

  const handleResolve = (
    conflictId: string,
    resolution: "current" | "incoming" | "both"
  ) => {
    if (activeFile) {
      onResolve(activeFile.filename, conflictId, resolution);
      
      // Check if all files are resolved
      const allResolved = files.every((f) => f.resolved);
      if (allResolved && onAllResolved) {
        setTimeout(() => onAllResolved(), 500);
      }
    }
  };

  const renderConflict = (conflict: Conflict) => {
    if (conflict.resolved) {
      // Show resolved content
      let resolvedContent = "";
      if (conflict.resolution === "current") {
        resolvedContent = conflict.currentContent;
      } else if (conflict.resolution === "incoming") {
        resolvedContent = conflict.incomingContent;
      } else if (conflict.resolution === "both") {
        resolvedContent = conflict.currentContent + "\n" + conflict.incomingContent;
      }

      return (
        <motion.div
          key={conflict.id}
          className="p-4 bg-success/10 border border-success/30 rounded"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Text size="sm" variant="success" weight="semibold">✓ Resolved</Text>
          </div>
          <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
            {resolvedContent}
          </pre>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={conflict.id}
        className="space-y-4 p-4 bg-card border border-border rounded"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <Text size="sm" variant="error" weight="semibold">⚠ Conflict</Text>
          <Text size="xs" variant="muted">{conflict.hint}</Text>
        </div>

        {/* Current version (HEAD) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <Text size="xs" variant="muted" className="font-mono">HEAD (Current)</Text>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/30 rounded">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
              {conflict.currentContent}
            </pre>
          </div>
        </div>

        {/* Divider */}
        <div className="text-center text-muted-foreground text-xs font-mono">=======</div>

        {/* Incoming version */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <Text size="xs" variant="muted" className="font-mono">Incoming</Text>
          </div>
          <div className="p-3 bg-secondary/10 border border-secondary/30 rounded">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
              {conflict.incomingContent}
            </pre>
          </div>
        </div>

        {/* Resolution buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResolve(conflict.id, "current")}
            className="flex-1"
          >
            Keep Current
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResolve(conflict.id, "incoming")}
            className="flex-1"
          >
            Keep Incoming
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleResolve(conflict.id, "both")}
            className="flex-1"
          >
            Keep Both
          </Button>
        </div>
      </motion.div>
    );
  };

  if (files.length === 0) {
    return (
      <Panel>
        <PanelContent>
          <Text>No conflicts to resolve.</Text>
        </PanelContent>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelHeader>
        <div className="flex items-center gap-2 overflow-x-auto">
          {files.map((file, index) => (
            <ConflictFileTab
              key={file.filename}
              file={file}
              isActive={index === activeFileIndex}
              onClick={() => setActiveFileIndex(index)}
            />
          ))}
        </div>
      </PanelHeader>
      <PanelContent>
        <AnimatePresence mode="wait">
          {activeFile && (
            <motion.div
              key={activeFile.filename}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="space-y-4">
                <div className="mb-4">
                  <Text size="sm" variant="muted" className="font-mono">
                    {activeFile.path}
                  </Text>
                </div>
                {activeFile.conflicts.map((conflict) => renderConflict(conflict))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PanelContent>
    </Panel>
  );
};

