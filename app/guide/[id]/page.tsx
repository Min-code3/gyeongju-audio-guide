'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { ALL_ATTRACTIONS } from '@/data/attractions';
import { useGuideStore } from '@/lib/store';
import { getAudio } from '@/lib/audioElement';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const AudioEngine = dynamic(() => import('@/components/AudioEngine'), { ssr: false });
const PlayerBar = dynamic(() => import('@/components/PlayerBar'), { ssr: false });

export default function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const attraction = ALL_ATTRACTIONS.find((a) => a.id === id);

  const router = useRouter();
  const { setAttraction, startGuide, userPosition, autoPlayEnabled, toggleAutoPlay } = useGuideStore();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (attraction) setAttraction(attraction);
  }, [attraction, setAttraction]);

  const handleStartClick = () => {
    // Show auto-play prompt before starting
    setShowPrompt(true);
  };

  const handleConfirm = (autoOn: boolean) => {
    // Sync store with user's choice
    if (autoOn !== autoPlayEnabled) toggleAutoPlay();

    // iOS unlock
    const audio = getAudio();
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    audio.play().catch(() => {});

    setShowPrompt(false);
    startGuide();
  };

  if (!attraction) return notFound();

  return (
    <main className="relative w-full h-dvh overflow-hidden bg-stone-100">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 bg-white rounded-full px-3 py-1.5 text-xs text-stone-600 shadow-md"
      >
        ← Back
      </button>

      {/* Auto-play toggle — top center */}
      <button
        onClick={toggleAutoPlay}
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-1.5 text-xs font-medium shadow-md transition-colors ${
          autoPlayEnabled ? 'bg-amber-600 text-white' : 'bg-white text-stone-400'
        }`}
      >
        {autoPlayEnabled ? 'Auto ON' : 'Auto OFF'}
      </button>

      {/* Full-screen map */}
      <div className="absolute inset-0 bottom-40">
        <Map attraction={attraction} userPosition={userPosition} />
      </div>

      <AudioEngine />

      <PlayerBar attraction={attraction} onStart={handleStartClick} />

      {/* Auto-play prompt */}
      {showPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl mx-6 px-6 pt-6 pb-7 shadow-xl">
            <p className="text-base font-bold text-stone-800 mb-1 text-center">Auto Play</p>
            <p className="text-sm text-stone-400 text-center mb-6 leading-relaxed">
              Audio starts automatically as you approach each spot.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-stone-200 text-sm text-stone-500 font-medium active:bg-stone-50"
              >
                Not now
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="flex-1 py-3 rounded-2xl bg-amber-600 text-white text-sm font-semibold active:bg-amber-700"
              >
                Auto Play ON
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
