'use client';

import { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Attraction, UserPosition } from '@/lib/types';
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
            label={{
              text: pin.name,
              fontSize: '11px',
              fontWeight: isActive_ ? 'bold' : 'normal',
              color: '#1c1917',
            }}
            icon={{
              path: CIRCLE_PATH,
              scale: isActive_ ? 11 : 8,
              fillColor: isVisited ? '#9ca3af' : isActive_ ? '#d97706' : '#1d4ed8',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            onClick={() => {
              if (isActive) triggerPinManual(pin.id);
            }}
          />
        );
      })}

      {/* Radius circle for pins not yet visited */}
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
