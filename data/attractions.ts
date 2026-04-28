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
      src: '/audio/dr-a1.m4a',
      transcript: '그렇다면 대릉원은 어떤 곳일까요? 경주시내 한복판 약 12만 평(약 12만 6천㎡, 축구장 18개 크기) 규모의 신라 시대 고분군입니다. 신라의 왕과 왕비, 귀족들이 잠든 23기의 고분이 모여 있어요.',
    },
    {
      id: 'dr-a2',
      src: '/audio/dr-a2.m4a',
      transcript: '미추왕릉 등 일부를 제외하고는 이 거대한 봉분들이 정확히 누구의 무덤인지 알 수 없대요.',
    },
    {
      id: 'dr-a3',
      src: '/audio/dr-a3.m4a',
      transcript: '이 고분들은 4~6세기경에 조성된 것으로, 1,500년 이상의 세월에도 형태를 잘 유지하고 있는 데는 이유가 있습니다. 대릉원에 있는 대부분의 고분은 먼저 나무로 방을 만들고, 그 위에 자갈과 돌을 층층이 쌓은 뒤, 다시 흙을 덮는 방식(돌무지덧널무덤)인데요. 이 구조는 외부 충격에 강하고 빗물 배수에도 유리해, 당시 사람들의 뛰어난 설계 지혜를 느낄 수 있습니다.',
    },
    {
      id: 'dr-a4',
      src: '/audio/dr-a4.m4a',
      transcript: '신라 시대 사람들은 무덤에 그 사람이 쓰던 물건을 같이 묻었는데, 그 이유는 사후 세계에서도 그 물건들을 그대로 사용할 것이라고 믿었기 때문입니다.',
    },
    {
      id: 'dr-a5',
      src: '/audio/dr-a5.m4a',
      transcript: '오션뷰, 리버뷰 카페는 들어보셨나요? 대릉원에서는 능을 바라보면서 커피를 마실 수 있는 \'능뷰 카페\'가 있답니다. 시간을 초월하는 느낌을 느껴보세요.',
    },
    {
      id: 'dr-a6',
      src: '/audio/dr-a6.m4a',
      transcript: '보통 \'고대 왕의 무덤\'이라고 하면 이집트의 뾰족한 피라미드나 으스스한 지하 묘지를 떠올리실 텐데요. 경주의 무덤들은 텔레토비 동산처럼 부드럽고 동글동글한 초록색 언덕 모양을 하고 있습니다. 그래서 한국인들에게 이곳은 무서운 무덤이 아니라, 봄에는 벚꽃을 보고 가을에는 단풍을 즐기는 평화로운 동네 공원처럼 사랑받고 있답니다.',
    },
  ],
  pins: [
    {
      id: 'cheonmachong',
      name: '천마총',
      lat: 35.83820,
      lng: 129.21050,
      radius: 100,
      arrivalSrc: '/audio/dr-cheonmachong-arrival.m4a',
      bBlock: {
        id: 'dr-cheonmachong-b',
        src: '/audio/dr-cheonmachong-b.m4a',
        transcript: '천마총은 유일하게 내부가 공개된 곳인데요. 1973년 당시 가장 큰 무덤인 황남대총을 발굴하기 전에 상대적으로 작은 무덤을 먼저 파보며 경험을 쌓으려 했던 연습용 발굴이었대요. 그런데 여기서 예상치 못한 보물들이 쏟아져 나오면서 세상을 놀라게 했죠. 현재 대릉원 내에서 유일하게 내부 관람이 가능한 고분입니다. 솔직히 규모는 그렇게 큰 편이 아니에요, 하지만 입장료가 3000원밖에 안하기도 하고, 경험삼아 들어가보는 것도 나쁘지 않다고 생각해요. 언제 살면서 진짜 무덤에 들어가 보겠어요.',
      },
    },
    {
      id: 'photospot',
      name: '목련 포토스팟',
      lat: 35.83882,
      lng: 129.21316,
      radius: 100,
      arrivalSrc: '/audio/dr-photospot-arrival.m4a',
      bBlock: {
        id: 'dr-photospot-b',
        src: '/audio/dr-photospot-b.m4a',
        transcript: '산책로를 걷다 보면, 사람들이 줄을 길게 늘어선 포토존이 하나 보입니다. 고분 사이에 우뚝 선 목련나무 한 그루가 프레임을 완성하며, 많은 여행자들이 인생샷을 남기고 있었습니다. 목련 포토존이 인스타그램에서 폭발적인 인기를 끌었어요. 고분 사이에 홀로 선 목련나무 아래에서 사진을 찍기 위한 여행객이 늘며 대릉원은 가장 낡은 곳에서 가장 힙한 배경으로 다시 태어납니다.',
      },
    },
  ],
};

// export const cheomseongdae: Attraction = { ... }
// export const wolji: Attraction = { ... }

export const ALL_ATTRACTIONS: Attraction[] = [daereungwon];
