/**
 * File Explorer Component
 * Tree view of repository files with status indicators
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { File, Folder, FolderOpen, GitBranch, Plus, X } from "lucide-react";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Text } from "@/ui/components/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitFile } from "@/game/sandbox/repoEnvironment";
import { FileStatusBadge } from "./FileStatusBadge";

interface FileTreeItem {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
  file?: GitFile;
}

interface FileExplorerProps {
  files: Record<string, GitFile>;
  currentBranch: string;
  currentFile: string | null;
  onFileSelect: (path: string) => void;
  onCreateFile?: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  currentBranch,
  currentFile,
  onFileSelect,
  onCreateFile,
}) => {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const path = newFileName.trim();
      if (onCreateFile) {
        onCreateFile(path);
        onFileSelect(path);
      }
      setNewFileName("");
      setShowNewFileInput(false);
    }
  };

  const buildTree = (): FileTreeItem[] => {
    const tree: Record<string, FileTreeItem> = {};

    Object.entries(files).forEach(([path, file]) => {
      const parts = path.split("/");
      let current = tree;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        if (isFile) {
          const folderPath = parts.slice(0, -1).join("/");
          const folderKey = folderPath || "root";
          
          if (!current[folderKey]) {
            current[folderKey] = {
              name: folderPath || "root",
              path: folderPath,
              type: "folder",
              children: [],
            };
          }
          
          current[folderKey].children = current[folderKey].children || [];
          current[folderKey].children!.push({
            name: part,
            path,
            type: "file",
            file,
          });
        } else {
          const folderPath = parts.slice(0, i + 1).join("/");
          const folderKey = folderPath;

          if (!current[folderKey]) {
            current[folderKey] = {
              name: part,
              path: folderPath,
              type: "folder",
              children: [],
            };
          }
          current = current[folderKey].children as any;
        }
      }
    });

    return Object.values(tree);
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderItem = (item: FileTreeItem, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(item.path);
    const isSelected = currentFile === item.path;

    if (item.type === "folder") {
      return (
        <div key={item.path}>
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-muted/50 ${
              isExpanded ? "bg-muted/30" : ""
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => toggleFolder(item.path)}
          >
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary" />
            ) : (
              <Folder className="w-4 h-4 text-primary" />
            )}
            <Text size="sm" className="flex-1">{item.name}</Text>
          </div>
          {isExpanded && item.children && (
            <div>
              {item.children.map(child => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={item.path}
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-muted/50 ${
            isSelected ? "bg-primary/20 border-l-2 border-primary" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onFileSelect(item.path)}
        >
          <File className="w-4 h-4 text-muted-foreground" />
          <Text size="sm" className="flex-1">{item.name}</Text>
          {item.file && <FileStatusBadge status={item.file.status} />}
        </div>
      );
    }
  };

  const tree = buildTree();

  return (
    <Panel className="h-full flex flex-col">
      <PanelHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <Text size="sm" weight="semibold">Files</Text>
            <span className="text-xs text-muted-foreground">({currentBranch})</span>
          </div>
          {onCreateFile && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNewFileInput(!showNewFileInput)}
              className="h-7 w-7 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </PanelHeader>
      <PanelContent className="flex-1 overflow-y-auto">
        {showNewFileInput && onCreateFile && (
          <div className="p-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateFile();
                  } else if (e.key === "Escape") {
                    setShowNewFileInput(false);
                    setNewFileName("");
                  }
                }}
                placeholder="filename.js"
                className="h-8 text-sm"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowNewFileInput(false);
                  setNewFileName("");
                }}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Text size="xs" variant="muted" className="mt-1">
              Press Enter to create, Esc to cancel
            </Text>
          </div>
        )}
        {tree.length === 0 ? (
          <div className="text-center py-8">
            <Text size="sm" variant="muted">No files yet</Text>
            <Text size="xs" variant="muted" className="mt-2">
              {onCreateFile ? "Click + to create a file" : "Initialize repository to get started"}
            </Text>
          </div>
        ) : (
          <div className="space-y-1">
            {tree.map(item => renderItem(item))}
          </div>
        )}
      </PanelContent>
    </Panel>
  );
};

