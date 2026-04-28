import { create } from 'zustand';
import { Attraction, GuideStatus, UserPosition } from './types';

interface GuideStore {
  // Data
  attraction: Attraction | null;
  setAttraction: (a: Attraction) => void;

  // GPS
  userPosition: UserPosition | null;
  setUserPosition: (pos: UserPosition) => void;

  // State machine
  status: GuideStatus;
  aBlockIndex: number;       // current A block index (attraction-level)
  triggeredPinId: string | null;  // pin whose B is playing / about to play
  pendingPinId: string | null;    // pin triggered while A block still playing
  visitedPinIds: string[];        // pins already visited (avoid re-triggering)

  // Player UI state
  isPlaying: boolean;
  progress: number;
  duration: number;
  setIsPlaying: (v: boolean) => void;
  setProgress: (v: number) => void;
  setDuration: (v: number) => void;

  // Player controls — registered by AudioEngine
  seekTo: (ratio: number) => void;
  togglePause: () => void;
  setPlayerControls: (seek: (r: number) => void, toggle: () => void) => void;

  // Actions
  startGuide: () => void;
  resumeGuide: () => void;

  // GPS or pin click → trigger B for a specific pin
  triggerPin: (pinId: string) => void;

  // Called by AudioEngine on segment end
  onABlockEnd: () => void;
  onArrivalEnd: () => void;
  onBBlockEnd: () => void;
}

export const useGuideStore = create<GuideStore>((set, get) => ({
  attraction: null,
  setAttraction: (attraction) => set({ attraction }),

  userPosition: null,
  setUserPosition: (pos) => set({ userPosition: pos }),

  status: 'IDLE',
  aBlockIndex: 0,
  triggeredPinId: null,
  pendingPinId: null,
  visitedPinIds: [],

  isPlaying: false,
  progress: 0,
  duration: 0,
  setIsPlaying: (v) => set({ isPlaying: v }),
  setProgress: (v) => set({ progress: v }),
  setDuration: (v) => set({ duration: v }),

  seekTo: () => {},
  togglePause: () => {},
  setPlayerControls: (seek, toggle) => set({ seekTo: seek, togglePause: toggle }),

  startGuide: () => {
    const { attraction } = get();
    if (!attraction || attraction.aBlocks.length === 0) return;
    set({ status: 'A_PLAYING', aBlockIndex: 0, visitedPinIds: [], pendingPinId: null });
  },

  resumeGuide: () => {
    const { attraction, aBlockIndex } = get();
    if (!attraction) return;
    const nextIndex = aBlockIndex + 1;
    if (nextIndex < attraction.aBlocks.length) {
      set({ status: 'A_PLAYING', aBlockIndex: nextIndex, triggeredPinId: null });
    } else {
      set({ status: 'A_LOOPING', aBlockIndex: 0, triggeredPinId: null });
    }
  },

  triggerPin: (pinId: string) => {
    const { status, visitedPinIds } = get();
    if (visitedPinIds.includes(pinId)) return;

    if (status === 'A_PLAYING' || status === 'A_LOOPING') {
      // Wait for current A block to finish
      set({ pendingPinId: pinId });
    } else if (status === 'B_ENDED') {
      // User tapped another pin while on resume screen — go directly to arrival
      set({
        status: 'ARRIVAL',
        triggeredPinId: pinId,
        pendingPinId: null,
        visitedPinIds: [...visitedPinIds, pinId],
      });
    }
  },

  onABlockEnd: () => {
    const { attraction, aBlockIndex, pendingPinId, visitedPinIds } = get();
    if (!attraction) return;

    if (pendingPinId) {
      set({
        status: 'ARRIVAL',
        triggeredPinId: pendingPinId,
        pendingPinId: null,
        visitedPinIds: [...visitedPinIds, pendingPinId],
      });
      return;
    }

    const nextIndex = aBlockIndex + 1;
    if (nextIndex < attraction.aBlocks.length) {
      set({ status: 'A_PLAYING', aBlockIndex: nextIndex });
    } else {
      set({ status: 'A_LOOPING', aBlockIndex: 0 });
    }
  },

  onArrivalEnd: () => set({ status: 'B_PLAYING' }),

  onBBlockEnd: () => set({ status: 'B_ENDED' }),
}));
