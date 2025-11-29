import { useGameStore } from "./gameStore";
import { ActState, GameScreen } from "./types";
import { transitionTo, getDefaultScreen, canTransition, getNextStates } from "./gameMachine";

/**
 * Game Actions - High-level actions that use the state machine
 */

/**
 * Start the game (transition from idle to act1)
 */
export const startGame = () => {
  console.log("🟣 [startGame] Called");
  const store = useGameStore.getState();
  console.log("🟣 [startGame] Current actState:", store.actState, "Current screen:", store.screen);
  const result = transitionTo(store.actState, "act1");
  console.log("🟣 [startGame] Transition result:", result);
  
  if (result.valid) {
    console.log("🟣 [startGame] Setting actState to act1");
    store.setActState("act1");
    if (result.screen) {
      console.log("🟣 [startGame] Setting screen to:", result.screen);
      store.setScreen(result.screen);
    }
    const updatedState = useGameStore.getState();
    console.log("🟣 [startGame] After update - screen:", updatedState.screen, "actState:", updatedState.actState);
  } else {
    console.warn("🟣 [startGame] Transition invalid:", result);
  }
};

/**
 * Complete an act and transition to next
 */
export const completeAct = (actNumber: number) => {
  console.log("🔵 [completeAct] Called with actNumber:", actNumber);
  const store = useGameStore.getState();
  const currentState = store.actState;
  console.log("🔵 [completeAct] Current state:", currentState);
  console.log("🔵 [completeAct] Current completedActs:", store.completedActs);
  
  // Map act number to state
  const actStateMap: Record<number, ActState> = {
    1: "act1",
    2: "act2",
    3: "act3",
    4: "act4",
    5: "act5",
  };
  
  const completeStateMap: Record<number, ActState> = {
    1: "act1_complete",
    2: "act2_complete",
    3: "act3_complete",
    4: "act4_complete",
    5: "act5_complete",
  };
  
  const nextStateMap: Record<number, ActState> = {
    1: "act2",
    2: "act3",
    3: "act4",
    4: "act5",
    5: "map",
  };
  
  const currentActState = actStateMap[actNumber];
  const completeState = completeStateMap[actNumber];
  const nextState = nextStateMap[actNumber];
  
  console.log("🔵 [completeAct] Mapped states:", { currentActState, completeState, nextState });
  
  if (!currentActState || !completeState || !nextState) {
    console.error(`❌ [completeAct] Invalid act number: ${actNumber}`);
    return;
  }
  
  // Check if we're in the right act state
  if (currentState !== currentActState && !currentState.startsWith(`act${actNumber}_`)) {
    console.warn(`⚠️ [completeAct] Cannot complete act ${actNumber} from state ${currentState}`);
    return;
  }
  
  // Transition to complete state
  const completeResult = transitionTo(currentState, completeState);
  console.log("🔵 [completeAct] Transition result:", completeResult);
  
  if (completeResult.valid) {
    console.log("🔵 [completeAct] Calling store.completeAct(", actNumber, ")");
    store.completeAct(actNumber);
    console.log("🔵 [completeAct] After store.completeAct, completedActs:", store.completedActs);
    console.log("🔵 [completeAct] After store.completeAct, actState:", store.actState);
    
    // Auto-transition to next state if not act 5
    if (actNumber < 5) {
      const nextResult = transitionTo(completeState, nextState);
      console.log("🔵 [completeAct] Transition to next state result:", nextResult);
      if (nextResult.valid && nextResult.screen) {
        console.log("🔵 [completeAct] Auto-navigating to:", nextResult.screen);
        store.setScreen(nextResult.screen);
        // Also set the act state for the next act
        const nextActState = actStateMap[actNumber + 1];
        if (nextActState) {
          console.log("🔵 [completeAct] Setting actState to:", nextActState);
          store.setActState(nextActState);
        }
        const finalState = useGameStore.getState();
        console.log("🔵 [completeAct] Final state after auto-navigation - screen:", finalState.screen, "actState:", finalState.actState);
      } else {
        console.warn("🔵 [completeAct] Transition to next state invalid or no screen:", nextResult);
      }
    } else {
      // Act 5 unlocks levels and goes to map
      console.log("🔵 [completeAct] Act 5 complete, going to map");
      const mapResult = transitionTo(completeState, "map");
      if (mapResult.valid && mapResult.screen) {
        store.setScreen(mapResult.screen);
      }
    }
  }
};

/**
 * Navigate to a specific screen (with state validation)
 */
export const navigateToScreen = (screen: GameScreen) => {
  console.log("🟢 [navigateToScreen] Called with screen:", screen);
  const store = useGameStore.getState();
  console.log("🟢 [navigateToScreen] Current actState:", store.actState);
  console.log("🟢 [navigateToScreen] Current screen:", store.screen);
  console.log("🟢 [navigateToScreen] Current completedActs:", store.completedActs);
  
  // Validate screen transition based on current state
  const screenStateMap: Partial<Record<GameScreen, ActState[]>> = {
    intro: ["idle"],
    home: ["idle", "act1_complete", "act2_complete", "act3_complete", "act4_complete", "act5_complete"],
    story: ["act1"],
    lesson: ["act1"],
    act2: ["act1_complete", "act2", "act2_complete"],
    act3: ["act2_complete", "act3", "act3_complete"],
    act4: ["act3_complete", "act4", "act4_complete"],
    act5: ["act4_complete", "act5", "act5_complete"],
    act6: ["act5_complete"],
    boss: ["act5_complete"],
    map: ["act5_complete", "map"],
    puzzle: ["map", "puzzle"],
    gameRound: ["act5_complete"],
    gameResults: ["act5_complete"],
    sandbox: ["act2_complete", "act3_complete", "act4_complete", "act5_complete"],
  };
  
  // Map screen to act state (for setting act state when navigating)
  const screenToActState: Partial<Record<GameScreen, ActState>> = {
    lesson: "act1",
    act2: "act2",
    act3: "act3",
    act4: "act4",
    act5: "act5",
  };
  
  const allowedStates = screenStateMap[screen];
  console.log("🟢 [navigateToScreen] Allowed states for", screen, ":", allowedStates);
  
  // Allow navigation to screens without state restrictions (like home, sandbox, gameRound)
  if (!allowedStates) {
    console.log("🟢 [navigateToScreen] No restrictions for", screen, "- allowing navigation");
    // For screens without restrictions, allow navigation
    store.setScreen(screen);
    const targetActState = screenToActState[screen];
    if (targetActState && !store.actState.startsWith(targetActState.split("_")[0])) {
      console.log("🟢 [navigateToScreen] Setting actState to:", targetActState);
      store.setActState(targetActState);
    }
    console.log("🟢 [navigateToScreen] Navigation complete. New screen:", store.screen, "New actState:", store.actState);
    return;
  }
  
  if (allowedStates) {
    // Check if current state is allowed
    const isAllowed = allowedStates.some(state => {
      console.log("🟢 [navigateToScreen] Checking state:", state, "against current:", store.actState);
      // Exact match
      if (store.actState === state) {
        console.log("🟢 [navigateToScreen] ✅ Exact match!");
        return true;
      }
      // Check if state starts with the base act (e.g., "act2" matches "act2_complete")
      const baseAct = state.split("_")[0];
      if (store.actState.startsWith(baseAct)) {
        console.log("🟢 [navigateToScreen] ✅ Starts with base act:", baseAct);
        return true;
      }
      // Also check if we're coming from a completed state to the next act
      // e.g., "act2_complete" should allow navigation to "act3"
      if (state.includes("_complete") && screen.startsWith("act")) {
        const actNumber = parseInt(screen.replace("act", ""));
        const currentActNumber = parseInt(store.actState.replace("act", "").split("_")[0]);
        console.log("🟢 [navigateToScreen] Checking transition: actNumber=", actNumber, "currentActNumber=", currentActNumber, "isComplete=", store.actState.includes("_complete"));
        if (currentActNumber === actNumber - 1 && store.actState.includes("_complete")) {
          console.log("🟢 [navigateToScreen] ✅ Transition from completed act allowed!");
          return true;
        }
      }
      return false;
    });
    
    console.log("🟢 [navigateToScreen] Final isAllowed result:", isAllowed);
    
    if (isAllowed) {
      console.log("🟢 [navigateToScreen] ✅ Navigation allowed! Setting screen to:", screen);
      console.log("🟢 [navigateToScreen] Before setScreen - screen:", store.screen, "actState:", store.actState);
      store.setScreen(screen);
      console.log("🟢 [navigateToScreen] After setScreen - reading state...");
      const stateAfterScreen = useGameStore.getState();
      console.log("🟢 [navigateToScreen] State after setScreen:", stateAfterScreen.screen, "actState:", stateAfterScreen.actState);
      
      // Set act state if navigating to an act screen
      const targetActState = screenToActState[screen];
      if (targetActState) {
        const currentActState = stateAfterScreen.actState;
        const targetBase = targetActState.split("_")[0];
        console.log("🟢 [navigateToScreen] Checking actState update - current:", currentActState, "target:", targetActState, "targetBase:", targetBase);
        if (!currentActState.startsWith(targetBase)) {
          console.log("🟢 [navigateToScreen] Setting actState to:", targetActState);
          store.setActState(targetActState);
          const stateAfterActState = useGameStore.getState();
          console.log("🟢 [navigateToScreen] State after setActState:", stateAfterActState.screen, "actState:", stateAfterActState.actState);
        } else {
          console.log("🟢 [navigateToScreen] actState already starts with", targetBase, "- not changing");
        }
      }
      // Read fresh state after all updates
      const finalState = useGameStore.getState();
      console.log("🟢 [navigateToScreen] ✅ Navigation complete. Final screen:", finalState.screen, "Final actState:", finalState.actState);
    } else {
      console.warn(`❌ [navigateToScreen] Cannot navigate to ${screen} from state ${store.actState}. Allowed states:`, allowedStates);
    }
  } else {
    console.warn(`❌ [navigateToScreen] No allowed states defined for screen: ${screen}`);
  }
};

/**
 * Go to next step in current act
 */
export const nextStep = () => {
  const store = useGameStore.getState();
  const nextStates = getNextStates(store.actState);
  
  if (nextStates.length > 0) {
    const nextState = nextStates[0];
    const result = transitionTo(store.actState, nextState);
    
    if (result.valid) {
      store.setActState(nextState);
      if (result.screen) {
        store.setScreen(result.screen);
      }
    }
  }
};

/**
 * Reset game to initial state
 */
export const resetGame = () => {
  const store = useGameStore.getState();
  store.reset();
  store.setActState("idle");
  store.setScreen("intro");
};

