'use client';

import { useEffect, useRef } from 'react';
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

function emojiIcon(pin: Pin, isActive: boolean, isVisited: boolean): google.maps.Icon {
  const emoji = pin.pinType === 'photo' ? '📷' : '🏛️';
  const size = isActive ? 44 : 36;
  const opacity = isVisited ? '0.4' : '1';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <text x="50%" y="80%" font-size="${size * 0.75}" text-anchor="middle" dominant-baseline="auto" opacity="${opacity}">${emoji}</text>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size),
  };
}

export default function Map({ attraction, userPosition }: MapProps) {
  const { status, triggeredPinId, visitedPinIds, triggerPinManual } = useGuideStore();
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  useEffect(() => {
    if (mapRef.current && userPosition) {
      mapRef.current.panTo({ lat: userPosition.lat, lng: userPosition.lng });
    }
  }, [userPosition]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">
        Loading map...
      </div>
    );
  }

  const isActive = status !== 'IDLE';

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={attraction.center}
      zoom={attraction.defaultZoom}
      options={{
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
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
            icon={emojiIcon(pin, isActive_, isVisited)}
            onClick={() => { if (isActive) triggerPinManual(pin.id); }}
          />
        );
      })}

      {/* Radius circle for unvisited pins */}
      {isActive && attraction.pins.map((pin) => {
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

      {/* User position */}
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
  );
}
