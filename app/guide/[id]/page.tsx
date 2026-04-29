'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_ATTRACTIONS } from '@/data/attractions';
import { useGuideStore } from '@/lib/store';

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
    // iOS audio unlock: play first audio file silently to register user gesture
    // html5 audio requires this so subsequent async plays are allowed
    if (attraction && typeof window !== 'undefined') {
      const unlock = new Audio(attraction.aBlocks[0]?.src ?? '');
      unlock.volume = 0;
      unlock.play().then(() => { unlock.pause(); }).catch(() => {});
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
