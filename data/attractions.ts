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
      radius: 50,
      pinType: 'spot',
      bBlock: { id: 'dr-cheonmachong-b', src: '/audio/dr-cheonmachong-b.mp3' },
    },
    {
      id: 'photospot',
      name: '목련 포토스팟',
      lat: 35.83884,
      lng: 129.21350,
      radius: 50,
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

export const woljeongyo: Attraction = {
  id: 'woljeongyo',
  name: '월정교',
  description: '신라 시대 복원된 아름다운 목조 교량.',
  center: { lat: 35.82909, lng: 129.21707 },
  defaultZoom: 17,
  aBlocks: [],
  pins: [
    {
      id: 'wj-photo1',
      name: '포토스팟 1',
      lat: 35.82891,
      lng: 129.21774,
      radius: 0,
      pinType: 'photo',
      // 오디오 없음 — 지도 마커 전용
    },
    {
      id: 'wj-photo2',
      name: '포토스팟 2',
      lat: 35.82927,
      lng: 129.21640,
      radius: 0,
      pinType: 'photo',
      // 오디오 없음 — 지도 마커 전용
    },
  ],
};

export const gyochonMaeul: Attraction = {
  id: 'gyochon-maeul',
  name: '교촌마을',
  description: '경주 최씨 고택이 있는 전통 한옥 마을.',
  center: { lat: 35.83090, lng: 129.21620 },
  defaultZoom: 17,
  aBlocks: [],
  pins: [
    {
      id: 'gc-choebuza',
      name: '최부자댁',
      lat: 35.83074,
      lng: 129.21620,
      radius: 50,
      pinType: 'spot',
      bBlock: { id: 'gc-choebuza-b', src: '/audio/gc-choebuza-b.mp3' },
    },
    {
      id: 'gc-tteok',
      name: '떡 체험',
      lat: 35.83014,
      lng: 129.21567,
      radius: 30,
      pinType: 'spot',
      bBlock: { id: 'gc-tteok-b', src: '/audio/gc-tteok-b.mp3' },
    },
    {
      id: 'gc-duiju',
      name: '뒤주',
      lat: 35.83090,
      lng: 129.21645,
      radius: 30,
      pinType: 'spot',
      autoPlay: false, // C가이드 — GPS/클릭만, A 끝난 후 자동재생 없음
      bBlock: { id: 'gc-duiju-b', src: '/audio/gc-duiju-b.mp3' },
    },
    {
      id: 'gc-anchae',
      name: '안채',
      lat: 35.83109,
      lng: 129.21632,
      radius: 30,
      pinType: 'spot',
      autoPlay: false, // C가이드
      bBlock: { id: 'gc-anchae-b', src: '/audio/gc-anchae-b.mp3' },
    },
  ],
};

export const ALL_ATTRACTIONS: Attraction[] = [daereungwon, cheomseongdae, woljeongyo, gyochonMaeul];
