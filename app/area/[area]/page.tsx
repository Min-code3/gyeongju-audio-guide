import { notFound } from 'next/navigation';
import { getAttractionsByArea } from '@/lib/data';
import AreaPageClient from './AreaPageClient';
import LangToggle from '@/components/LangToggle';

export default async function AreaPage({
  params,
  searchParams,
}: {
  params: Promise<{ area: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const [{ area }, { lang = 'ko' }] = await Promise.all([params, searchParams]);
  const decodedArea = decodeURIComponent(area);

  const attractions = await getAttractionsByArea(decodedArea, lang as 'ko' | 'en');
  if (attractions.length === 0) return notFound();

  const lats = attractions.map((a) => a.center.lat).filter(Boolean);
  const lngs = attractions.map((a) => a.center.lng).filter(Boolean);
  const center =
    lats.length > 0
      ? {
          lat: lats.reduce((s, v) => s + v, 0) / lats.length,
          lng: lngs.reduce((s, v) => s + v, 0) / lngs.length,
        }
      : { lat: 35.8402, lng: 129.2098 };

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <LangToggle />
      </div>
      <AreaPageClient area={decodedArea} lang={lang} attractions={attractions} center={center} />
    </>
  );
}
