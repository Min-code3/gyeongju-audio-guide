import { Attraction } from '@/lib/types';
import { getAreaRows, getAttractionRows, getPinpointRows, AreaRow } from '@/lib/sheets';
import { getAttractionFromAPI, getAttractionFromEngAPI, getAttractionImages } from '@/lib/tourapi';

type Lang = 'ko' | 'en';

function buildAttraction(
  row: Awaited<ReturnType<typeof getAttractionRows>>[number],
  pinpoints: Awaited<ReturnType<typeof getPinpointRows>>,
  apiData: Awaited<ReturnType<typeof getAttractionFromAPI>>,
  images: string[],
): Attraction {
  const myPins = pinpoints.filter((p) => p.attractionName === row.name);

  const aBlocks = myPins
    .filter((p) => p.type === 'A')
    .map((p) => ({ id: p.id, src: p.audioSrc, title: p.audioTitle || undefined }));

  const pins = myPins
    .filter((p) => p.type !== 'A')
    .map((p) => ({
      id: p.id,
      name: p.pinName,
      lat: p.lat,
      lng: p.lng,
      radius: p.radius,
      pinType: p.type === 'P' ? ('photo' as const) : ('spot' as const),
      autoPlay: p.autoplay,
      routeOrder: p.routeOrder,
      isMainRoute: p.isMainRoute,
      bBlock: p.audioSrc ? { id: p.id + '-b', src: p.audioSrc, title: p.audioTitle || undefined } : undefined,
    }));

  return {
    id: row.id,
    name: apiData.name,
    description: apiData.description,
    center: apiData.center,
    hours: apiData.hours,
    admission: row.admission || apiData.admission,
    defaultZoom: row.defaultZoom,
    tags: row.tags,
    images,
    aBlocks,
    pins,
  };
}

async function fetchAPIData(row: { korContentId: string; engContentId: string }, lang: Lang) {
  const contentId = lang === 'en' ? row.engContentId : row.korContentId;
  const [apiData, images] = await Promise.all([
    lang === 'en'
      ? getAttractionFromEngAPI(contentId)
      : getAttractionFromAPI(contentId),
    getAttractionImages(row.korContentId), // 이미지는 항상 한국어 API (detailImage2는 KorService2만 지원)
  ]);
  return { apiData, images };
}

export async function getAreas(): Promise<AreaRow[]> {
  return getAreaRows();
}

export async function getAttractionsByArea(area: string, lang: Lang = 'ko'): Promise<Attraction[]> {
  const [attractionRows, pinpoints] = await Promise.all([
    getAttractionRows(),
    getPinpointRows(),
  ]);

  const rows = attractionRows
    .filter((r) => r.area === area)
    .sort((a, b) => a.priority - b.priority);

  return Promise.all(
    rows.map(async (row) => {
      const { apiData, images } = await fetchAPIData(row, lang);
      return buildAttraction(row, pinpoints, apiData, images);
    }),
  );
}

export async function getAttractionById(id: string, lang: Lang = 'ko'): Promise<Attraction | null> {
  const [attractionRows, pinpoints] = await Promise.all([
    getAttractionRows(),
    getPinpointRows(),
  ]);

  const row = attractionRows.find((r) => r.id === id);
  if (!row) return null;

  const { apiData, images } = await fetchAPIData(row, lang);
  return buildAttraction(row, pinpoints, apiData, images);
}
