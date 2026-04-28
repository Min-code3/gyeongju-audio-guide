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

export default function PlayerBar({ attraction, onStart }: PlayerBarProps) {
  const {
    status, aBlockIndex, triggeredPinId,
    isPlaying, progress, duration,
    seekTo, togglePause, resumeGuide,
  } = useGuideStore();

  const triggeredPin = attraction.pins.find((p) => p.id === triggeredPinId);

  const currentTranscript = (() => {
    if (status === 'A_PLAYING' || status === 'A_LOOPING')
      return attraction.aBlocks[aBlockIndex]?.transcript ?? null;
    if (status === 'B_PLAYING')
      return triggeredPin?.bBlock.transcript ?? null;
    return null;
  })();

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

  // ── B_ENDED — Resume screen ────────────────────────────────────────────────
  if (status === 'B_ENDED') {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl px-6 pt-5 pb-10">
        <p className="text-xs text-amber-600 uppercase tracking-wide font-medium mb-1">
          Guide paused
        </p>
        <p className="text-base font-bold text-stone-800 mb-1">
          {triggeredPin?.name ?? 'Location'}
        </p>
        <p className="text-sm text-stone-400 mb-6">
          Take your time. Resume the guide when you're ready to move on.
        </p>
        <button
          onClick={resumeGuide}
          className="w-full bg-amber-600 text-white rounded-2xl py-4 font-semibold text-base active:bg-amber-700 transition-colors"
        >
          Continue Guide →
        </button>
      </div>
    );
  }

  // ── ARRIVAL ────────────────────────────────────────────────────────────────
  if (status === 'ARRIVAL') {
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl px-6 pt-5 pb-10">
        <p className="text-xs text-amber-600 uppercase tracking-wide font-medium mb-1">Arrived</p>
        <p className="text-base font-bold text-stone-800">{triggeredPin?.name ?? 'Location'}</p>
      </div>
    );
  }

  // ── ACTIVE player (A_PLAYING / A_LOOPING / B_PLAYING) ─────────────────────
  const statusLabel =
    status === 'B_PLAYING' ? `At · ${triggeredPin?.name}` : 'On the way';

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl px-5 pt-4 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">
            {statusLabel}
          </p>
          <p className="text-base font-bold text-stone-800 truncate">{attraction.name}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <input
          type="range"
          min={0}
          max={1}
          step={0.001}
          value={progress}
          onChange={(e) => seekTo(parseFloat(e.target.value))}
          className="w-full h-1 accent-amber-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-stone-400 mt-0.5">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Play / Pause */}
      <div className="flex items-center justify-center mb-4">
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
      </div>

      {/* Transcript */}
      {currentTranscript && (
        <div className="bg-stone-50 rounded-2xl px-4 py-3 max-h-28 overflow-y-auto">
          <p className="text-xs text-stone-500 leading-relaxed">{currentTranscript}</p>
        </div>
      )}
    </div>
  );
}
