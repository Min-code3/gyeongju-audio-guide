import { Tour } from '@/lib/types';
import { daereungwon, cheomseongdae, woljeongyo, gyochonMaeul, donggungWolji } from './attractions';

export const gyeongjuDowntown: Tour = {
  id: 'gyeongju-downtown',
  name: 'Gyeongju Downtown Walk',
  description: 'Walk through 1,000 years of Silla history in Gyeongju.',
  center: { lat: 35.8360, lng: 129.2160 },
  defaultZoom: 14,
  attractions: [daereungwon, cheomseongdae, woljeongyo, gyochonMaeul, donggungWolji],
};

export const ALL_TOURS: Tour[] = [gyeongjuDowntown];
