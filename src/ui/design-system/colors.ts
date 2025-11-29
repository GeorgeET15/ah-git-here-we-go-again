/**
 * Color System
 * PRESERVING EXISTING COLOR PALETTE (as requested)
 * All colors in HSL format matching current design
 */

export const colors = {
  // Background colors
  background: 'hsl(210 29% 7%)',
  card: 'hsl(215 28% 11%)',
  popover: 'hsl(215 28% 11%)',
  
  // Text colors
  foreground: 'hsl(213 27% 92%)',
  mutedForeground: 'hsl(218 14% 56%)',
  
  // Primary (green)
  primary: 'hsl(137 55% 41%)',
  primaryForeground: 'hsl(0 0% 100%)',
  
  // Secondary (gray)
  secondary: 'hsl(220 13% 18%)',
  secondaryForeground: 'hsl(213 27% 92%)',
  
  // Muted
  muted: 'hsl(220 13% 18%)',
  
  // Semantic colors
  success: 'hsl(137 55% 41%)',
  error: 'hsl(0 84% 60%)',
  warning: 'hsl(45 93% 58%)',
  
  // Terminal & Editor
  terminalBg: 'hsl(215 28% 8%)',
  terminalText: 'hsl(142 71% 61%)',
  editorBg: 'hsl(215 28% 11%)',
  
  // Borders
  border: 'hsla(0 0% 100% / 0.08)',
  
  // Commit colors
  commitUnlocked: 'hsl(137 55% 41%)',
  commitLocked: 'hsl(220 9% 46%)',
} as const;

