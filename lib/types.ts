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
  bBlock: AudioBlock;
}

export interface Attraction {
  id: string;
  name: string;
  description?: string;
  center: { lat: number; lng: number };
  defaultZoom: number;
  aBlocks: AudioBlock[];
  pins: Pin[];
}

export type GuideStatus =
  | 'IDLE'
  | 'A_PLAYING'
  | 'GUIDE_ENDED'
  | 'B_PLAYING';

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
}
