'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_ATTRACTIONS } from '@/data/attractions';
import { useGuideStore } from '@/lib/store';
import { getAudio } from '@/lib/audioElement';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const AudioEngine = dynamic(() => import('@/components/AudioEngine'), { ssr: false });
const PlayerBar = dynamic(() => import('@/components/PlayerBar'), { ssr: false });

export default function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const attraction = ALL_ATTRACTIONS.find((a) => a.id === id);

  const { setAttraction, startGuide, userPosition } = useGuideStore();

  useEffect(() => {
    if (attraction) setAttraction(attraction);
  }, [attraction, setAttraction]);

  const handleStart = () => {
    // Unlock the SAME <audio> element that AudioEngine will reuse.
    // iOS only needs one play() call per element — subsequent src changes work freely.
    if (attraction) {
      const audio = getAudio();
      audio.src = attraction.aBlocks[0]?.src ?? '';
      audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
    }
    startGuide();
  };

  if (!attraction) return notFound();

  return (
    <main className="relative w-full h-dvh overflow-hidden bg-stone-100">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 bg-white rounded-full px-3 py-1.5 text-xs text-stone-600 shadow-md"
      >
        ← Back
      </Link>

      {/* Full-screen map */}
      <div className="absolute inset-0 bottom-40">
        <Map attraction={attraction} userPosition={userPosition} />
      </div>

      {/* Logic-only layer */}
      <AudioEngine />

      {/* Bottom player */}
      <PlayerBar attraction={attraction} onStart={handleStart} />
    </main>
  );
}
