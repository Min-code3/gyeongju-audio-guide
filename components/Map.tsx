'use client';

import { useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Attraction, Pin, UserPosition } from '@/lib/types';
import { useGuideStore } from '@/lib/store';

interface MapProps {
  attraction: Attraction;
  userPosition: UserPosition | null;
}

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f0e8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e8f5' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e9c7' }] },
];

const CIRCLE_PATH = 0 as unknown as google.maps.SymbolPath;

function pinColor(pin: Pin, isActive: boolean, isVisited: boolean): string {
  if (isVisited) return '#9ca3af';
  if (isActive) return '#d97706';
  return pin.pinType === 'photo' ? '#10b981' : '#1d4ed8';
}

export default function Map({ attraction, userPosition }: MapProps) {
  const { status, triggeredPinId, visitedPinIds, triggerPinManual } = useGuideStore();
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  const handleLocateMe = () => {
    if (mapRef.current && userPosition) {
      mapRef.current.panTo({ lat: userPosition.lat, lng: userPosition.lng });
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">
        Loading map...
      </div>
    );
  }

  const isActive = status !== 'IDLE';

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={attraction.center}
        zoom={attraction.defaultZoom}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: { position: 7 }, // RIGHT_TOP — above PlayerBar
          gestureHandling: 'greedy',
        }}
        onLoad={(map) => { mapRef.current = map; }}
      >
        {attraction.pins.map((pin) => {
          const isVisited = visitedPinIds.includes(pin.id);
          const isActive_ = pin.id === triggeredPinId;

          return (
            <Marker
              key={pin.id}
              position={{ lat: pin.lat, lng: pin.lng }}
              icon={{
              path: CIRCLE_PATH,
              scale: isActive_ ? 11 : 8,
              fillColor: pinColor(pin, isActive_, isVisited),
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
              onClick={() => { if (isActive && pin.bBlock) triggerPinManual(pin.id); }}
            />
          );
        })}

        {/* Radius circle for unvisited pins with audio */}
        {isActive && attraction.pins.map((pin) => {
          if (!pin.bBlock || pin.radius === 0) return null;
          if (visitedPinIds.includes(pin.id)) return null;
          return (
            <Circle
              key={`circle-${pin.id}`}
              center={{ lat: pin.lat, lng: pin.lng }}
              radius={pin.radius}
              options={{
                fillColor: '#d97706',
                fillOpacity: 0.08,
                strokeColor: '#d97706',
                strokeOpacity: 0.3,
                strokeWeight: 1,
              }}
            />
          );
        })}

        {/* User position dot */}
        {userPosition && (
          <Marker
            position={{ lat: userPosition.lat, lng: userPosition.lng }}
            icon={{
              path: CIRCLE_PATH,
              scale: 8,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>

      {/* Current location button */}
      {userPosition && (
        <button
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center active:bg-stone-100 transition-colors"
          aria-label="현재 위치로 이동"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </button>
      )}
    </div>
  );
}
