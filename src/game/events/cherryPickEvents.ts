import { eventBus } from "./eventBus";
import { CherryPickEvent } from "./types";
import { useGameStore } from "@/game/state/gameStore";

/**
 * Cherry-Pick Event Handlers
 */

export const emitCherryPickApplied = (commitSha: string, targetBranch: string) => {
  const event: CherryPickEvent = {
    type: "CHERRYPICK/APPLY",
    timestamp: Date.now(),
    payload: {
      commitSha,
      targetBranch,
    },
  };
  
  eventBus.emit(event);
  
  // Update game state
  const store = useGameStore.getState();
  store.addTerminalLine({
    type: "success",
    text: `Cherry-pick applied: ${commitSha} to ${targetBranch}`,
  });
};

export const subscribeToCherryPickEvents = (handler: (event: CherryPickEvent) => void) => {
  return eventBus.on("CHERRYPICK/APPLY", handler);
};


