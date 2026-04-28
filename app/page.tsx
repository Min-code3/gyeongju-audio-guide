import Link from 'next/link';
import { ALL_ATTRACTIONS } from '@/data/attractions';

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-stone-50 px-5 pt-14 pb-10">
      <p className="text-xs text-amber-600 uppercase tracking-widest font-medium mb-1">
        Gyeongju
      </p>
      <h1 className="text-2xl font-bold text-stone-900 mb-1">Audio Guide</h1>
      <p className="text-sm text-stone-400 mb-8">
        Walk at your own pace. The guide follows you.
      </p>

      <div className="flex flex-col gap-3">
        {ALL_ATTRACTIONS.map((attraction) => (
          <Link
            key={attraction.id}
            href={`/guide/${attraction.id}`}
            className="block bg-white rounded-2xl px-5 py-4 shadow-sm active:bg-stone-50 transition-colors"
          >
            <p className="text-base font-semibold text-stone-800">{attraction.name}</p>
            {attraction.description && (
              <p className="text-sm text-stone-400 mt-0.5 line-clamp-2">
                {attraction.description}
              </p>
            )}
            <p className="text-xs text-amber-600 mt-2">
              {attraction.pins.length} spots · {attraction.aBlocks.length} audio segments
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
