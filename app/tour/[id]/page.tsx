'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ALL_TOURS } from '@/data/tours';

const TourMap = dynamic(() => import('@/components/TourMap'), { ssr: false });

export default function TourPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const tour = ALL_TOURS.find((t) => t.id === id);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!tour) return notFound();

  const handleCardTap = (attractionId: string) => {
    if (selectedId === attractionId) {
      // Second tap on same card → go to guide
      router.push(`/guide/${attractionId}`);
    } else {
      // First tap → select and pan map
      setSelectedId(attractionId);
    }
  };

  return (
    <main className="flex flex-col h-dvh overflow-hidden bg-stone-50">
      {/* Map */}
      <div className="h-[45vh] shrink-0">
        <TourMap
          attractions={tour.attractions}
          center={tour.center}
          defaultZoom={tour.defaultZoom}
          selectedId={selectedId}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-4 pb-2 bg-stone-50">
        <Link href="/" className="text-xs text-stone-400 mb-1 block">← Back</Link>
        <h1 className="text-lg font-bold text-stone-800">{tour.name}</h1>
      </div>

      {/* Attraction list */}
      <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-3">
        {tour.attractions.map((attraction) => {
          const isSelected = selectedId === attraction.id;
          return (
            <button
              key={attraction.id}
              className={`w-full text-left bg-white rounded-2xl shadow-sm px-5 py-4 transition-all active:bg-stone-50 ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
              onClick={() => handleCardTap(attraction.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-base font-bold text-stone-800">{attraction.name}</p>
                  {attraction.description && (
                    <p className="text-sm text-stone-400 mt-0.5 line-clamp-2">{attraction.description}</p>
                  )}
                  <p className="text-xs text-stone-300 mt-1">
                    {attraction.pins.length} spot{attraction.pins.length !== 1 ? 's' : ''}
                    {attraction.aBlocks.length > 0 ? ` · ${attraction.aBlocks.length} audio segments` : ''}
                  </p>
                </div>
                <span className="text-amber-500 text-lg shrink-0">
                  {isSelected ? '→' : '›'}
                </span>
              </div>
              {isSelected && (
                <p className="text-xs text-amber-600 mt-2 font-medium">Tap again to start guide</p>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
