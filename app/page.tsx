import Link from 'next/link';
import { ALL_TOURS } from '@/data/tours';

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
        {ALL_TOURS.map((tour) => (
          <Link
            key={tour.id}
            href={`/tour/${tour.id}`}
            className="block bg-white rounded-2xl px-5 py-5 shadow-sm active:bg-stone-50 transition-colors"
          >
            <p className="text-base font-bold text-stone-800">{tour.name}</p>
            {tour.description && (
              <p className="text-sm text-stone-400 mt-1">{tour.description}</p>
            )}
            <p className="text-xs text-amber-600 mt-3">
              {tour.attractions.length} stops
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
