import { eventBus } from "./eventBus";
import { MergeEvent } from "./types";
import { useGameStore } from "@/game/state/gameStore";

/**
 * Merge Event Handlers
 */

export const emitMergeConflictResolved = (
  conflictId: string,
  resolution: "head" | "incoming" | "both"
) => {
  const event: MergeEvent = {
    type: "MERGE/RESOLVE_CONFLICT",
    timestamp: Date.now(),
    payload: {
      conflictId,
      resolution,
    },
  };
  
  eventBus.emit(event);
  
  // Update game state
  const store = useGameStore.getState();
  store.addTerminalLine({
    type: "success",
    text: `Conflict resolved: ${resolution}`,
  });
};

export const subscribeToMergeEvents = (handler: (event: MergeEvent) => void) => {
  return eventBus.on("MERGE/RESOLVE_CONFLICT", handler);
};


