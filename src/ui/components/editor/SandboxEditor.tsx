/**
 * Sandbox Editor Component
 * Code editor for sandbox mode with syntax highlighting
 */

import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { oneDark } from "@codemirror/theme-one-dark";
import { Panel, PanelHeader, PanelContent } from "@/ui/components/Panel";
import { Text } from "@/ui/components/Typography";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { GitFile } from "@/game/sandbox/repoEnvironment";
import { repoEnvironment } from "@/game/sandbox/repoEnvironment";

interface SandboxEditorProps {
  file: GitFile | null;
  filePath: string | null;
  onSave: (path: string, content: string) => void;
  onCreateFile?: (path: string) => void;
}

export const SandboxEditor: React.FC<SandboxEditorProps> = ({ file, filePath, onSave, onCreateFile }) => {
  const [content, setContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isNewFile, setIsNewFile] = useState(false);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setHasChanges(false);
      setIsNewFile(false);
    } else if (filePath && onCreateFile) {
      // File path provided but file doesn't exist - allow creating it
      setContent("");
      setHasChanges(false);
      setIsNewFile(true);
    } else {
      setContent("");
      setHasChanges(false);
      setIsNewFile(false);
    }
  }, [file, filePath, onCreateFile]);

  const getLanguage = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return javascript({ jsx: ext === 'jsx' || ext === 'tsx' });
      case 'py':
        return python();
      case 'json':
        return json();
      case 'cpp':
      case 'cxx':
      case 'cc':
      case 'c':
        return cpp();
      case 'html':
        return html();
      case 'css':
        return css();
      default:
        return null;
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    setHasChanges(value !== file?.content);
  };

  const handleSave = () => {
    if (file) {
      onSave(file.path, content);
      setHasChanges(false);
      setIsNewFile(false);
    } else if (filePath && onCreateFile) {
      // Create new file
      onCreateFile(filePath);
      onSave(filePath, content);
      setHasChanges(false);
      setIsNewFile(false);
    }
  };

  const handleReset = () => {
    if (file) {
      setContent(file.content);
      setHasChanges(false);
      setIsNewFile(false);
    } else if (isNewFile) {
      setContent("");
      setHasChanges(false);
    }
  };

  if (!file && !isNewFile) {
    return (
      <Panel className="h-full flex flex-col">
        <PanelHeader>
          <Text size="sm" weight="semibold">Editor</Text>
        </PanelHeader>
        <PanelContent className="flex-1 flex items-center justify-center">
          <Text variant="muted" size="sm">Select a file to edit or create a new one</Text>
        </PanelContent>
      </Panel>
    );
  }

  const displayPath = file?.path || filePath || "new file";

  return (
    <Panel className="h-full flex flex-col">
      <PanelHeader>
        <div className="flex items-center justify-between w-full">
          <Text size="sm" weight="semibold">
            {displayPath}
            {isNewFile && <span className="text-muted-foreground ml-2">(new)</span>}
          </Text>
          <div className="flex gap-2">
            {hasChanges && !isNewFile && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges && !isNewFile}
            >
              <Save className="w-4 h-4 mr-1" />
              {isNewFile ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </PanelHeader>
      <PanelContent className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden rounded border border-border [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto">
          <CodeMirror
            value={content}
            height="100%"
            onChange={handleContentChange}
            extensions={displayPath ? [getLanguage(displayPath)].filter(Boolean) : []}
            theme={oneDark}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
            }}
            placeholder="File content..."
          />
        </div>
        {hasChanges && (
          <div className="mt-2 text-xs text-warning">
            * Unsaved changes
          </div>
        )}
      </PanelContent>
    </Panel>
  );
};

