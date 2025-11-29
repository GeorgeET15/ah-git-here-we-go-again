import type { StateCreator } from "zustand";

/**
 * UISlice
 * - Global UI-related flags that are not purely local component state
 * - Currently includes concept panel visibility and editor/timeline UI mirrors
 */

export interface UISliceState {
  showConceptPanel: boolean;
  editorContent: string;
  timelineState: Record<string, unknown>;
}

export interface UISliceActions {
  setConceptPanelVisible: (show: boolean) => void;
  updateEditorContent: (content: string) => void;
  setTimelineState: (state: Record<string, unknown>) => void;
}

export type UISlice = UISliceState & UISliceActions;

export const createUISlice: StateCreator<any, [], [], UISlice> = (set) => ({
  showConceptPanel: false,
  editorContent: "",
  timelineState: {},

  setConceptPanelVisible: (show: boolean) => set({ showConceptPanel: show }),

  updateEditorContent: (content: string) => set({ editorContent: content }),

  setTimelineState: (state: Record<string, unknown>) =>
    set({ timelineState: state }),
});


