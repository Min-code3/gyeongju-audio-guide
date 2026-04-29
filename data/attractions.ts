import { Attraction } from '@/lib/types';

export const daereungwon: Attraction = {
  id: 'daereungwon',
  name: '대릉원',
  description: '경주 시내 한복판, 신라 왕과 귀족들이 잠든 23기의 고분군.',
  center: { lat: 35.83851, lng: 129.21183 },
  defaultZoom: 16,
  aBlocks: [
    {
      id: 'dr-a1',
      src: '/audio/dr-a1.mp3',
      transcript: '그렇다면 대릉원은 어떤 곳일까요? 경주시내 한복판 약 12만 평(약 12만 6천㎡, 축구장 18개 크기) 규모의 신라 시대 고분군입니다. 신라의 왕과 왕비, 귀족들이 잠든 23기의 고분이 모여 있어요.',
    },
    {
      id: 'dr-a2',
      src: '/audio/dr-a2.mp3',
      transcript: '미추왕릉 등 일부를 제외하고는 이 거대한 봉분들이 정확히 누구의 무덤인지 알 수 없대요.',
    },
    {
      id: 'dr-a3',
      src: '/audio/dr-a3.mp3',
      transcript: '이 고분들은 4~6세기경에 조성된 것으로, 1,500년 이상의 세월에도 형태를 잘 유지하고 있는 데는 이유가 있습니다. 대릉원에 있는 대부분의 고분은 먼저 나무로 방을 만들고, 그 위에 자갈과 돌을 층층이 쌓은 뒤, 다시 흙을 덮는 방식(돌무지덧널무덤)인데요.',
    },
    // a4, a5, a6 추가 예정
  ],
  pins: [
    {
      id: 'cheonmachong',
      name: '천마총',
      lat: 35.83820,
      lng: 129.21050,
      radius: 100,
      bBlock: {
        id: 'dr-cheonmachong-b',
        src: '/audio/dr-cheonmachong-b.mp3',
        transcript: '천마총은 유일하게 내부가 공개된 곳인데요. 1973년 당시 가장 큰 무덤인 황남대총을 발굴하기 전에 상대적으로 작은 무덤을 먼저 파보며 경험을 쌓으려 했던 연습용 발굴이었대요.',
      },
    },
    {
      id: 'photospot',
      name: '목련 포토스팟',
      lat: 35.83882,
      lng: 129.21316,
      radius: 100,
      bBlock: {
        id: 'dr-photospot-b',
        src: '/audio/dr-photospot-b.mp3',
        transcript: '산책로를 걷다 보면, 사람들이 줄을 길게 늘어선 포토존이 하나 보입니다. 고분 사이에 우뚝 선 목련나무 한 그루가 프레임을 완성하며, 많은 여행자들이 인생샷을 남기고 있었습니다.',
      },
    },
  ],
};

export const cheomseongdae: Attraction = {
  id: 'cheomseongdae',
  name: '첨성대',
  description: '동양에서 가장 오래된 천문대, 신라 선덕여왕 시대의 유산.',
  center: { lat: 35.83452, lng: 129.21900 },
  defaultZoom: 17,
  aBlocks: [], // 추가 예정
  pins: [
    {
      id: 'cs-cheomseongdae',
      name: '첨성대',
      lat: 35.83452,
      lng: 129.21900,
      radius: 100,
      bBlock: {
        id: 'cs-cheomseongdae-b',
        src: '/audio/cs-cheomseongdae-b.mp3',
        transcript: '', // 스크립트 추가 예정
      },
    },
  ],
};

export const ALL_ATTRACTIONS: Attraction[] = [daereungwon, cheomseongdae];
