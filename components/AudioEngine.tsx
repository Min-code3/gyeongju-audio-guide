'use client';

import { useEffect, useRef } from 'react';
import { useGuideStore } from '@/lib/store';
import { isWithinRadius } from '@/lib/geofence';
import { getAudio } from '@/lib/audioElement';

export default function AudioEngine() {
  const {
    attraction, status, aBlockIndex, triggeredPinId,
    setUserPosition, setPlayerControls,
    setIsPlaying, setProgress, setDuration,
    onABlockEnd, onBBlockEnd, triggerPin,
  } = useGuideStore();

  const rafRef = useRef<number>(0);

  // ─── GPS watch ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setUserPosition({ lat, lng, accuracy });

        const { status: s, attraction: a } = useGuideStore.getState();
        if (!a) return;
        // For attractions with no A-guide, GPS works even in IDLE
        const noAGuide = a.aBlocks.length === 0;
        if (!noAGuide && (s === 'IDLE' || s === 'GUIDE_ENDED')) return;
        if (s === 'GUIDE_ENDED' && !noAGuide) return;

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
    const audio = getAudio();
    audio.pause();

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

    audio.src = src;
    audio.currentTime = 0;

    audio.onplay = () => {
      setIsPlaying(true);
      const tick = () => {
        if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    audio.onloadedmetadata = () => setDuration(audio.duration);

    audio.onpause = () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
      cancelAnimationFrame(rafRef.current);
      onEnd();
    };

    // Register player controls
    setPlayerControls(
      (ratio) => { audio.currentTime = audio.duration * ratio; },
      () => { audio.paused ? audio.play().catch(console.warn) : audio.pause(); },
    );

    audio.play().catch(console.warn);

    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, aBlockIndex, triggeredPinId, attraction]);

  return null;
}
