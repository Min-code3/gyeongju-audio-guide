// Single <audio> element reused throughout the session.
// iOS only requires unlock once per element — reusing the same element
// means subsequent src changes and play() calls work without user gesture.
let _audio: HTMLAudioElement | null = null;

export function getAudio(): HTMLAudioElement {
  if (!_audio && typeof window !== 'undefined') {
    _audio = document.createElement('audio');
    (_audio as HTMLAudioElement & { playsInline: boolean }).playsInline = true;
  }
  return _audio!;
}
