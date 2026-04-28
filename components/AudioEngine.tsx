'use client';

import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGuideStore } from '@/lib/store';
import { isWithinRadius } from '@/lib/geofence';

export default function AudioEngine() {
  const {
    attraction, status, aBlockIndex, triggeredPinId,
    setUserPosition, setPlayerControls,
    setIsPlaying, setProgress, setDuration,
    onABlockEnd, onArrivalEnd, onBBlockEnd, triggerPin,
  } = useGuideStore();

  const howlRef = useRef<Howl | null>(null);
  const rafRef = useRef<number>(0);

  // ─── GPS watch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setUserPosition({ lat, lng, accuracy });

        if (!attraction || status === 'IDLE' || status === 'B_ENDED') return;

        for (const pin of attraction.pins) {
          if (isWithinRadius(lat, lng, pin.lat, pin.lng, pin.radius)) {
            triggerPin(pin.id);
            break;
          }
        }
      },
      (err) => console.warn('GPS error:', err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [attraction, status, setUserPosition, triggerPin]);

  // ─── Audio playback ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!attraction) return;

    cancelAnimationFrame(rafRef.current);
    howlRef.current?.stop();
    howlRef.current = null;

    let src: string | null = null;
    let onEnd: () => void = () => {};

    if (status === 'A_PLAYING' || status === 'A_LOOPING') {
      src = attraction.aBlocks[aBlockIndex]?.src ?? null;
      onEnd = onABlockEnd;
    } else if (status === 'ARRIVAL') {
      const pin = attraction.pins.find((p) => p.id === triggeredPinId);
      src = pin?.arrivalSrc ?? null;
      onEnd = onArrivalEnd;
    } else if (status === 'B_PLAYING') {
      const pin = attraction.pins.find((p) => p.id === triggeredPinId);
      src = pin?.bBlock.src ?? null;
      onEnd = onBBlockEnd;
    }

    if (!src) return;

    const howl = new Howl({
      src: [src],
      html5: true,
      onend: onEnd,
      onplay: () => {
        setIsPlaying(true);
        setDuration(howl.duration());
        const tick = () => {
          const seek = howl.seek();
          if (typeof seek === 'number') setProgress(seek / howl.duration());
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      },
      onpause: () => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); },
      onstop: () => { setIsPlaying(false); setProgress(0); cancelAnimationFrame(rafRef.current); },
      onloaderror: (_, err) => console.warn('Audio load error:', src, err),
    });

    setPlayerControls(
      (ratio) => howl.seek(howl.duration() * ratio),
      () => howl.playing() ? howl.pause() : howl.play(),
    );

    howl.play();
    howlRef.current = howl;

    return () => { cancelAnimationFrame(rafRef.current); howl.stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, aBlockIndex, triggeredPinId, attraction]);

  return null;
}
