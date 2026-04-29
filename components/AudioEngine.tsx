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
    onABlockEnd, onBBlockEnd, triggerPin,
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

        const { status: s, attraction: a } = useGuideStore.getState();
        if (!a || s === 'IDLE' || s === 'GUIDE_ENDED') return;

        for (const pin of a.pins) {
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
  }, [setUserPosition, triggerPin]);

  // ─── Audio playback ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!attraction) return;

    cancelAnimationFrame(rafRef.current);
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
      howlRef.current = null;
    }

    let src: string | null = null;
    let onEnd: () => void = () => {};

    if (status === 'A_PLAYING') {
      src = attraction.aBlocks[aBlockIndex]?.src ?? null;
      onEnd = onABlockEnd;
    } else if (status === 'B_PLAYING') {
      const pin = attraction.pins.find((p) => p.id === triggeredPinId);
      src = pin?.bBlock.src ?? null;
      onEnd = onBBlockEnd;
    }

    if (!src) {
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      return;
    }

    const howl = new Howl({
      src: [src],
      html5: true,
      onend: onEnd,
      onplay: () => {
        setIsPlaying(true);
        setDuration(howl.duration());

        const tick = () => {
          const h = howlRef.current;
          if (!h) return;
          const seek = h.seek();
          const dur = h.duration();
          if (typeof seek === 'number' && dur > 0) setProgress(seek / dur);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      },
      onpause: () => { setIsPlaying(false); cancelAnimationFrame(rafRef.current); },
      onstop: () => { setIsPlaying(false); setProgress(0); cancelAnimationFrame(rafRef.current); },
      onloaderror: (_, err) => console.warn('Audio load error:', src, err),
    });

    howlRef.current = howl;

    setPlayerControls(
      (ratio) => {
        const h = howlRef.current;
        if (h) h.seek(h.duration() * ratio);
      },
      () => {
        const h = howlRef.current;
        if (!h) return;
        const playing = useGuideStore.getState().isPlaying;
        if (playing) { h.pause(); } else { h.play(); }
      },
    );

    howl.play();

    return () => {
      cancelAnimationFrame(rafRef.current);
      howl.stop();
      howl.unload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, aBlockIndex, triggeredPinId, attraction]);

  return null;
}
