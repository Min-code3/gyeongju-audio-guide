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
    <main className="relative flex flex-col h-dvh overflow-hidden bg-stone-50">
      {/* Back button — top left, same as guide page */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 bg-white rounded-full px-3 py-1.5 text-xs text-stone-600 shadow-md"
      >
        ← Back
      </button>

      {/* Map */}
      <div className="h-[45vh] shrink-0">
        <TourMap
          attractions={tour.attractions}
          center={tour.center}
          defaultZoom={tour.defaultZoom}
          selectedId={selectedId}
          onPinClick={handleCardTap}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-4 pb-2 bg-stone-50">
        <h1 className="text-lg font-bold text-stone-800">{tour.name}</h1>
        {tour.tags && tour.tags.length > 0 && (
          <div className="flex gap-2 mt-1.5">
            {tour.tags.map((tag) => (
              <span key={tag} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        )}
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
                  {(() => {
                    const title = attraction.guideTitle ?? attraction.name;
                    const hasEmoji = title.startsWith('🌆');
                    const text = hasEmoji ? title.slice(2) : title;
                    return (
                      <div className="flex items-center gap-1">
                        <span className="text-base w-6 shrink-0 text-center">{hasEmoji ? '🌆' : ''}</span>
                        <p className="text-base font-bold text-stone-800">{text}</p>
                      </div>
                    );
                  })()}
                  {attraction.description && (
                    <p className="text-sm text-stone-400 mt-0.5 line-clamp-2">{attraction.description}</p>
                  )}
                  {(attraction.admission || attraction.hours) && (
                    <p className="text-xs text-stone-400 mt-1">
                      {attraction.admission && `🎫 ${attraction.admission}`}
                      {attraction.admission && attraction.hours && '  '}
                      {attraction.hours && `⏰ ${attraction.hours}`}
                    </p>
                  )}
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
