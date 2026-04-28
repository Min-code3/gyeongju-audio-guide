export interface AudioBlock {
  id: string;
  src: string;
  transcript?: string;
}

export interface Pin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  arrivalSrc: string;
  bBlock: AudioBlock;
}

export interface Attraction {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  center: { lat: number; lng: number };
  defaultZoom: number;
  aBlocks: AudioBlock[];
  pins: Pin[];
}

export type GuideStatus =
  | 'IDLE'
  | 'A_PLAYING'
  | 'GUIDE_ENDED' // all A blocks played once — no more auto-play
  | 'ARRIVAL'
  | 'B_PLAYING'
  | 'B_ENDED';

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
}
