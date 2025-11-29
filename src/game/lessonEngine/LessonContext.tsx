/**
 * React Context for Lesson Engine
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { LessonEngine, lessonEngine } from "./LessonEngine";
import { LessonEngineState, LessonStep } from "./types";
import { lessonEventBus } from "./events";

interface LessonContextValue {
  engine: LessonEngine;
  state: LessonEngineState;
  currentStep: LessonStep | null;
  loadLesson: (actId: number) => Promise<void>;
  nextStep: () => boolean;
  goToStep: (stepId: string) => boolean;
  handleCommand: (command: string) => { success: boolean; output?: any[] };
  getSuggestions: () => Array<{ command: string; hint: string }>;
  getInitialOutput: () => any[];
}

const LessonContext = createContext<LessonContextValue | null>(null);

export const useLessonEngine = (): LessonContextValue => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error("useLessonEngine must be used within LessonEngineProvider");
  }
  return context;
};

interface LessonEngineProviderProps {
  children: React.ReactNode;
  actId: number;
}

export const LessonEngineProvider: React.FC<LessonEngineProviderProps> = ({
  children,
  actId,
}) => {
  const [state, setState] = useState<LessonEngineState>(lessonEngine.getState());

  useEffect(() => {
    // Load lesson when actId changes
    lessonEngine.loadLesson(actId).then(() => {
      setState(lessonEngine.getState());
    });

    // Subscribe to state changes
    const unsubscribe = lessonEventBus.on("step.started", () => {
      setState(lessonEngine.getState());
    });

    return () => {
      unsubscribe();
    };
  }, [actId]);

  const loadLesson = useCallback(async (actId: number) => {
    await lessonEngine.loadLesson(actId);
    setState(lessonEngine.getState());
  }, []);

  const nextStep = useCallback(() => {
    const moved = lessonEngine.nextStep();
    setState(lessonEngine.getState());
    return moved;
  }, []);

  const handleCommand = useCallback((command: string) => {
    const result = lessonEngine.handleCommand(command);
    setState(lessonEngine.getState());
    return result;
  }, []);

  const goToStep = useCallback((stepId: string) => {
    const moved = lessonEngine.goToStep(stepId);
    setState(lessonEngine.getState());
    return moved;
  }, []);

  const getSuggestions = useCallback(() => {
    return lessonEngine.getSuggestions();
  }, []);

  const getInitialOutput = useCallback(() => {
    return lessonEngine.getInitialOutput();
  }, []);

  const value: LessonContextValue = useMemo(() => ({
    engine: lessonEngine,
    state,
    currentStep: state.currentStep,
    loadLesson,
    nextStep,
    goToStep,
    handleCommand,
    getSuggestions,
    getInitialOutput,
  }), [state, loadLesson, nextStep, goToStep, handleCommand, getSuggestions, getInitialOutput]);

  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
};

