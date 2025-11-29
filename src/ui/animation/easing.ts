/**
 * Custom Easing Functions
 * Provides smooth, natural-feeling animation curves
 */

export const easing = {
  // Standard easing curves
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  
  // Spring-like curves
  spring: [0.68, -0.55, 0.265, 1.55],
  springGentle: [0.5, 0, 0.5, 1],
  springBounce: [0.68, -0.6, 0.32, 1.6],
  
  // Dramatic curves
  dramatic: [0.25, 0.46, 0.45, 0.94],
  cinematic: [0.17, 0.67, 0.83, 0.67],
  
  // Smooth curves
  smooth: [0.43, 0.13, 0.23, 0.96],
  smoothOut: [0.16, 1, 0.3, 1],
};

