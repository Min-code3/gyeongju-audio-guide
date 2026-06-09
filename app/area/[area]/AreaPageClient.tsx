'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Attraction } from '@/lib/types';

const TourMap = dynamic(() => import('@/components/TourMap'), { ssr: false });

interface Props {
  area: string;
  lang: string;
  attractions: Attraction[];
  center: { lat: number; lng: number };
}

export default function AreaPageClient({ area, lang, attractions, center }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCardTap = (attractionId: string) => {
    if (selectedId === attractionId) {
      router.push(`/guide/${attractionId}?lang=${lang}`);
    } else {
      setSelectedId(attractionId);
    }
  };

  return (
    <main className="relative flex flex-col h-dvh overflow-hidden bg-stone-50">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-50 bg-white rounded-full px-3 py-1.5 text-xs text-stone-600 shadow-md"
      >
        ← Back
      </button>

      <div className="h-[45vh] shrink-0">
        <TourMap
          attractions={attractions}
          center={center}
          defaultZoom={13}
          selectedId={selectedId}
          onPinClick={handleCardTap}
        />
      </div>

      <div className="px-5 pt-4 pb-2 bg-stone-50">
        <h1 className="text-lg font-bold text-stone-800">{area}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-3">
        {attractions.map((attraction) => {
          const isSelected = selectedId === attraction.id;
          // force https to avoid mixed-content block
          const thumb = attraction.images?.[0]?.replace(/^http:\/\//i, 'https://');
          return (
            <button
              key={attraction.id}
              className={`w-full text-left bg-white rounded-2xl shadow-sm overflow-hidden transition-all active:bg-stone-50 ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
              onClick={() => handleCardTap(attraction.id)}
            >
              {thumb && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={attraction.name}
                  className="w-full h-36 object-cover"
                />
              )}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-stone-800">{attraction.name}</p>
                      {attraction.tags && attraction.tags.length > 0 && (
                        <span className="text-sm">{attraction.tags[0]}</span>
                      )}
                    </div>
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
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}
