'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Attraction } from '@/lib/types';
import { t } from '@/lib/i18n';
import ImageLightbox from '@/components/ImageLightbox';

const TourMap = dynamic(() => import('@/components/TourMap'), { ssr: false });

interface Props {
  area: string;
  lang: string;
  attractions: Attraction[];
  tagMap: Record<string, string>; // { '🌆': 'Night View', ... }
  center: { lat: number; lng: number };
}

interface LightboxState {
  images: string[];
  index: number;
}

function toHttps(url: string) {
  return url.replace(/^http:\/\//i, 'https://');
}


export default function AreaPageClient({ area, lang, attractions, tagMap, center }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // collect unique tags that at least one attraction has
  const allTags = useMemo(() => {
    const seen = new Set<string>();
    attractions.forEach((a) => a.tags?.forEach((t) => seen.add(t)));
    return Array.from(seen);
  }, [attractions]);

  // when a tag is toggled, bump matching attractions to the top (preserve relative order within each group)
  const visible = activeTag
    ? [
        ...attractions.filter((a) => a.tags?.includes(activeTag)),
        ...attractions.filter((a) => !a.tags?.includes(activeTag)),
      ]
    : attractions;

  const handleCardTap = (attractionId: string) => {
    if (selectedId === attractionId) {
      router.push(`/guide/${attractionId}?lang=${lang}`);
    } else {
      setSelectedId(attractionId);
    }
  };

  const openLightbox = (images: string[], index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox({ images, index });
  };


  return (
    <>
      <main className="relative flex flex-col h-dvh overflow-hidden bg-stone-50">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-50 bg-white rounded-full px-3 py-1.5 text-xs text-stone-600 shadow-md"
        >
          {t(lang as 'ko' | 'en', 'back')}
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

        {/* title + filter chips */}
        <div className="px-5 pt-4 pb-3 bg-stone-50">
          <h1 className="text-lg font-bold text-stone-800 mb-2">{area}</h1>
          {allTags.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {allTags.map((tag) => {
                const active = activeTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(active ? null : tag)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                      active
                        ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-sm'
                        : 'bg-white border-amber-300 text-amber-700'
                    }`}
                  >
                    {tagMap[tag] ?? tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-3">
          {visible.map((attraction) => {
            const isSelected = selectedId === attraction.id;
            const images = (attraction.images ?? []).map(toHttps);
            const thumb = images[0];

            return (
              <button
                key={attraction.id}
                className={`w-full text-left bg-white rounded-2xl shadow-sm px-5 py-4 transition-all active:bg-stone-50 ${isSelected ? 'ring-2 ring-amber-500' : ''}`}
                onClick={() => handleCardTap(attraction.id)}
              >
                <div className="flex items-start gap-3">
                  {/* text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-stone-800">{attraction.name}</p>
                      {attraction.star && (
                        <span className="text-sm">{attraction.star}</span>
                      )}
                    </div>
                    {attraction.description && (
                      <p className="text-sm text-stone-400 mt-0.5 line-clamp-2">{attraction.description}</p>
                    )}
                    {(attraction.admission || attraction.hours || attraction.tags?.length) && (
                      <div className="flex items-center gap-1 mt-1">
                        {/* tag emoji only (before first space) — fixed width so 🎫 always aligns */}
                        <span className="inline-block w-5 text-center text-sm leading-none">
                          {attraction.tags?.[0]?.split(' ')[0] ?? ''}
                        </span>
                        <p className="text-xs text-stone-400">
                          {attraction.admission && `🎫 ${attraction.admission}`}
                          {attraction.admission && attraction.hours && '  '}
                          {attraction.hours && `⏰ ${attraction.hours}`}
                        </p>
                      </div>
                    )}
                    {isSelected && (
                      <p className="text-xs text-amber-600 mt-2 font-medium">{t(lang as 'ko' | 'en', 'tapAgain')}</p>
                    )}
                  </div>

                  {/* thumbnail — fixed 80×80, inline style enforces regardless of CSS cascade */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => openLightbox(images, 0, e)}
                    onKeyDown={(e) => e.key === 'Enter' && openLightbox(images, 0, e as never)}
                    className="shrink-0 rounded-xl overflow-hidden cursor-pointer bg-stone-100 flex items-center justify-center text-stone-300 text-2xl"
                    style={{ width: 80, height: 80, minWidth: 80, maxWidth: 80, minHeight: 80, maxHeight: 80 }}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={attraction.name}
                        style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }}
                      />
                    ) : '🏛'}
                  </div>

                  <span className="text-amber-500 text-lg shrink-0 self-center">
                    {isSelected ? '→' : '›'}
                  </span>
                </div>
              </button>
            );
          })}

        </div>
      </main>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox((lb) => lb && { ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length })}
          onNext={() => setLightbox((lb) => lb && { ...lb, index: (lb.index + 1) % lb.images.length })}
        />
      )}
    </>
  );
}
