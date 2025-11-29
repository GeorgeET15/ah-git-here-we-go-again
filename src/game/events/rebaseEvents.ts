import { eventBus } from "./eventBus";
import { RebaseEvent } from "./types";
import { useGameStore } from "@/game/state/gameStore";

/**
 * Rebase Event Handlers
 */

export const emitRebaseCommitApplied = (commitId: string, position: number) => {
  const event: RebaseEvent = {
    type: "REBASE/APPLY_COMMIT",
    timestamp: Date.now(),
    payload: {
      commitId,
      position,
    },
  };
  
  eventBus.emit(event);
  
  // Update game state
  const store = useGameStore.getState();
  store.addTerminalLine({
    type: "success",
    text: `Commit ${commitId} replayed at position ${position}`,
  });
};

export const subscribeToRebaseEvents = (handler: (event: RebaseEvent) => void) => {
  return eventBus.on("REBASE/APPLY_COMMIT", handler);
};


