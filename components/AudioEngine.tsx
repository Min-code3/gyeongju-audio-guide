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
  const soundIdRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  // ─── GPS watch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setUserPosition({ lat, lng, accuracy });

        const { status: s, attraction: a } = useGuideStore.getState();
        if (!a || s === 'IDLE' || s === 'B_ENDED' || s === 'GUIDE_ENDED') return;

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
    soundIdRef.current = null;

    let src: string | null = null;
    let onEnd: () => void = () => {};

    if (status === 'A_PLAYING') {
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

    // GUIDE_ENDED / B_ENDED / IDLE → no audio
    if (!src) {
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      return;
    }

    const howl = new Howl({
      src: [src],
      html5: true,
      onend: (id) => {
        if (id === soundIdRef.current) onEnd();
      },
      onplay: (id) => {
        soundIdRef.current = id;
        setIsPlaying(true);
        setDuration(howl.duration(id));

        const tick = () => {
          const seek = howl.seek(id);
          const dur = howl.duration(id);
          if (typeof seek === 'number' && dur > 0) {
            setProgress(seek / dur);
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      },
      onpause: () => {
        setIsPlaying(false);
        cancelAnimationFrame(rafRef.current);
      },
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
        cancelAnimationFrame(rafRef.current);
      },
      onloaderror: (_, err) => console.warn('Audio load error:', src, err),
    });

    // Register controls — use soundIdRef so pause targets the right instance
    setPlayerControls(
      (ratio) => {
        const id = soundIdRef.current;
        if (id !== null) howl.seek(howl.duration(id) * ratio, id);
      },
      () => {
        const id = soundIdRef.current;
        if (id === null) return;
        if (howl.playing(id)) {
          howl.pause(id);
        } else {
          howl.play(id);
        }
      },
    );

    const id = howl.play();
    soundIdRef.current = id;
    howlRef.current = howl;

    return () => {
      cancelAnimationFrame(rafRef.current);
      howl.stop();
      howl.unload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, aBlockIndex, triggeredPinId, attraction]);

  return null;
}
