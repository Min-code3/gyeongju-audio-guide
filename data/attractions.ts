import { Attraction } from '@/lib/types';

export const daereungwon: Attraction = {
  id: 'daereungwon',
  name: '대릉원',
  description: '경주 시내 한복판, 신라 왕과 귀족들이 잠든 23기의 고분군.',
  center: { lat: 35.83851, lng: 129.21183 },
  defaultZoom: 16,
  aBlocks: [
    { id: 'dr-a1', src: '/audio/dr-a1.mp3' },
    { id: 'dr-a2', src: '/audio/dr-a2.mp3' },
    { id: 'dr-a3', src: '/audio/dr-a3.mp3' },
    // a4, a5, a6 추가 예정
  ],
  pins: [
    {
      id: 'cheonmachong',
      name: '천마총',
      lat: 35.83820,
      lng: 129.21050,
      radius: 100,
      pinType: 'spot',
      bBlock: { id: 'dr-cheonmachong-b', src: '/audio/dr-cheonmachong-b.mp3' },
    },
    {
      id: 'photospot',
      name: '목련 포토스팟',
      lat: 35.83882,
      lng: 129.21316,
      radius: 100,
      pinType: 'photo',
      bBlock: { id: 'dr-photospot-b', src: '/audio/dr-photospot-b.mp3' },
    },
  ],
};

export const cheomseongdae: Attraction = {
  id: 'cheomseongdae',
  name: '첨성대',
  description: '동양에서 가장 오래된 천문대, 신라 선덕여왕 시대의 유산.',
  center: { lat: 35.83452, lng: 129.21900 },
  defaultZoom: 17,
  aBlocks: [],
  pins: [
    {
      id: 'cs-cheomseongdae',
      name: '첨성대',
      lat: 35.83452,
      lng: 129.21900,
      radius: 100,
      pinType: 'spot',
      bBlock: { id: 'cs-cheomseongdae-b', src: '/audio/cs-cheomseongdae-b.mp3' },
    },
  ],
};

export const ALL_ATTRACTIONS: Attraction[] = [daereungwon, cheomseongdae];
