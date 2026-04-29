'use client';

import { useGuideStore } from '@/lib/store';
import { Attraction } from '@/lib/types';

interface PlayerBarProps {
  attraction: Attraction;
  onStart: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function PlayPauseButton() {
  const { isPlaying, togglePause } = useGuideStore();
  return (
    <button
      onClick={togglePause}
      className="w-14 h-14 rounded-full bg-amber-600 text-white flex items-center justify-center active:bg-amber-700 transition-colors"
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      )}
    </button>
  );
}

function PrevNextButtons() {
  const { prevBlock, nextBlock, aBlockIndex, attraction } = useGuideStore();
  if (!attraction) return null;
  const isFirst = aBlockIndex === 0;
  const isLast = aBlockIndex >= attraction.aBlocks.length - 1;

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={prevBlock}
        disabled={isFirst}
        className="w-10 h-10 flex items-center justify-center text-stone-400 disabled:opacity-30"
        aria-label="Previous block"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
        </svg>
      </button>
      <PlayPauseButton />
      <button
        onClick={nextBlock}
        disabled={isLast}
        className="w-10 h-10 flex items-center justify-center text-stone-400 disabled:opacity-30"
        aria-label="Next block"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zm10-12v12h2V6h-2z" />
        </svg>
      </button>
    </div>
  );
}

export default function PlayerBar({ attraction, onStart }: PlayerBarProps) {
  const {
    status, aBlockIndex, triggeredPinId,
    progress, duration, seekTo,
  } = useGuideStore();

  const triggeredPin = attraction.pins.find((p) => p.id === triggeredPinId);
  const elapsed = duration * progress;

  // ── IDLE ───────────────────────────────────────────────────────────────────
  if (status === 'IDLE') {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl px-6 pt-5 pb-10">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Audio Guide</p>
        <p className="text-lg font-bold text-stone-800 mb-1">{attraction.name}</p>
        <p className="text-sm text-stone-400 mb-6">{attraction.description}</p>
        <button
          onClick={onStart}
          className="w-full bg-amber-600 text-white rounded-2xl py-4 font-semibold text-base active:bg-amber-700 transition-colors"
        >
          Start Audio Guide
        </button>
      </div>
    );
  }

  // ── GUIDE_ENDED ────────────────────────────────────────────────────────────
  if (status === 'GUIDE_ENDED') {
    const hasABlocks = attraction.aBlocks.length > 0;
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl px-6 pt-5 pb-10">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
          {hasABlocks ? 'Guide complete' : 'Explore'}
        </p>
        <p className="text-base font-bold text-stone-800 mb-1">{attraction.name}</p>
        <p className="text-sm text-stone-400 mb-4">
          {hasABlocks ? 'Tap a pin on the map to hear its guide.' : 'Tap a pin on the map to hear its guide.'}
        </p>
        {hasABlocks && (
          <div className="flex items-center justify-center">
            <PrevNextButtons />
          </div>
        )}
      </div>
    );
  }

  // ── ACTIVE (A_PLAYING / B_PLAYING) ─────────────────────────────────────────
  const statusLabel = status === 'B_PLAYING'
    ? `At · ${triggeredPin?.name}`
    : `Block ${aBlockIndex + 1} of ${attraction.aBlocks.length}`;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl px-5 pt-4 pb-10">
      <div className="mb-3">
        <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">{statusLabel}</p>
        <p className="text-base font-bold text-stone-800 truncate">{attraction.name}</p>
      </div>

      <div className="mb-2">
        <input
          type="range" min={0} max={1} step={0.001} value={progress}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="w-full h-1 accent-amber-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-stone-400 mt-0.5">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        {status === 'A_PLAYING' ? <PrevNextButtons /> : <PlayPauseButton />}
      </div>

    </div>
  );
}
