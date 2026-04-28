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
  aBlocks: AudioBlock[]; // attraction-level narrative — plays continuously
  pins: Pin[];
}

export type GuideStatus =
  | 'IDLE'
  | 'A_PLAYING'
  | 'A_LOOPING'  // all A blocks exhausted, looping first block
  | 'ARRIVAL'    // playing arrival announcement for triggeredPinId
  | 'B_PLAYING'  // playing B guide for triggeredPinId
  | 'B_ENDED';   // B done — waiting for user to press Resume

export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number;
}
