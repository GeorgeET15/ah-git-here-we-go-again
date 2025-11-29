/**
 * File Status Badge
 * Shows file status (M/S/U/D)
 */

import React from "react";
import { Text } from "@/ui/components/Typography";

interface FileStatusBadgeProps {
  status: "tracked" | "modified" | "staged" | "untracked" | "deleted";
}

export const FileStatusBadge: React.FC<FileStatusBadgeProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "modified":
        return { label: "M", color: "text-warning", bg: "bg-warning/20" };
      case "staged":
        return { label: "S", color: "text-success", bg: "bg-success/20" };
      case "untracked":
        return { label: "U", color: "text-primary", bg: "bg-primary/20" };
      case "deleted":
        return { label: "D", color: "text-error", bg: "bg-error/20" };
      default:
        return null;
    }
  };

  const info = getStatusInfo();
  if (!info) return null;

  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${info.color} ${info.bg}`}>
      {info.label}
    </span>
  );
};

