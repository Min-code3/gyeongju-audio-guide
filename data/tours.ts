import { Tour } from '@/lib/types';
import { daereungwon, cheomseongdae, woljeongyo, gyochonMaeul } from './attractions';

export const gyeongjuDowntown: Tour = {
  id: 'gyeongju-downtown',
  name: 'Gyeongju Downtown Tour',
  description: 'Walk through 1,500 years of Silla history in the heart of Gyeongju.',
  center: { lat: 35.8360, lng: 129.2160 },
  defaultZoom: 14,
  attractions: [daereungwon, cheomseongdae, woljeongyo, gyochonMaeul],
};

export const ALL_TOURS: Tour[] = [gyeongjuDowntown];
