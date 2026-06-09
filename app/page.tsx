import Link from 'next/link';
import { getAreas } from '@/lib/data';
import LangToggle from '@/components/LangToggle';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang = 'ko' } = await searchParams;
  const areas = await getAreas();

  return (
    <main className="min-h-dvh bg-stone-50 px-5 pt-14 pb-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1">Korea Audio Guide</h1>
          <p className="text-sm text-stone-400">Walk at your own pace. The guide follows you.</p>
        </div>
        <LangToggle />
      </div>

      <div className="flex flex-col gap-3">
        {areas.map((area) => (
          <Link
            key={area.area}
            href={`/area/${encodeURIComponent(area.area)}?lang=${lang}`}
            className="block bg-white rounded-2xl px-5 py-5 shadow-sm active:bg-stone-50 transition-colors"
          >
            <p className="text-xs text-amber-600 uppercase tracking-widest font-medium mb-1">
              {area.nation}
            </p>
            <p className="text-base font-bold text-stone-800">{area.area}</p>
            {area.description && (
              <p className="text-sm text-stone-400 mt-1">{area.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
