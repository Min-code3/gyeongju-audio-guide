'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaRow } from '@/lib/sheets';
import ImageLightbox from '@/components/ImageLightbox';

interface Props {
  areas: AreaRow[];
  coverImages: Record<string, string[]>;
  lang: string;
}

interface LightboxState { images: string[]; index: number; }

export default function HomePageClient({ areas, coverImages, lang }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [thumbIndices, setThumbIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    const indices: Record<string, number> = {};
    areas.forEach((area) => {
      const imgs = coverImages[area.area] ?? [];
      if (imgs.length > 0) indices[area.area] = Math.floor(Math.random() * imgs.length);
    });
    setThumbIndices(indices);
  }, [areas, coverImages]);

  const open = (images: string[], index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox({ images, index });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {areas.map((area) => {
          const images = coverImages[area.area] ?? [];
          const thumbIdx = thumbIndices[area.area] ?? 0;
          const thumb = images[thumbIdx];

          return (
            <div key={area.area} className="flex items-center bg-white rounded-2xl shadow-sm overflow-hidden">
              <Link
                href={`/area/${encodeURIComponent(area.area)}?lang=${lang}`}
                className="flex-1 min-w-0 px-5 py-5 active:bg-stone-50 transition-colors"
              >
                <p className="text-xs text-amber-600 uppercase tracking-widest font-medium mb-1">{area.nation}</p>
                <p className="text-base font-bold text-stone-800">{area.area}</p>
                {area.description && <p className="text-sm text-stone-400 mt-1">{area.description}</p>}
              </Link>

              {thumb ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => open(images, thumbIdx, e)}
                  onKeyDown={(e) => e.key === 'Enter' && open(images, thumbIdx, e as never)}
                  className="shrink-0 cursor-pointer"
                  style={{ width: 80, height: 80, minWidth: 80 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt={area.area} style={{ width: 80, height: 80, objectFit: 'cover', display: 'block' }} />
                </div>
              ) : (
                <div className="shrink-0 bg-stone-100 flex items-center justify-center text-stone-300 text-2xl" style={{ width: 80, height: 80, minWidth: 80 }}>🗺</div>
              )}
            </div>
          );
        })}
      </div>

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
