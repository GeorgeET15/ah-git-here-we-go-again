import { eventBus } from "./eventBus";
import { TimelineEvent } from "./types";

/**
 * Timeline Event Handlers
 */

export const emitTimelineCommit = (commitId: string, branch: string) => {
  const event: TimelineEvent = {
    type: "TIMELINE/APPLY_COMMIT",
    timestamp: Date.now(),
    payload: {
      commitId,
      branch,
    },
  };
  
  eventBus.emit(event);
};

export const subscribeToTimelineEvents = (handler: (event: TimelineEvent) => void) => {
  return eventBus.on("TIMELINE/APPLY_COMMIT", handler);
};


