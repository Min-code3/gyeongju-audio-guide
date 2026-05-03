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

function pinIcon(pin: Pin, isActive: boolean, isVisited: boolean): google.maps.Symbol | google.maps.Icon {
  const opacity = isVisited ? 0.4 : 1;

  if (pin.routeOrder !== undefined) {
    const color = isActive ? '#6d28d9' : (pin.isMainRoute !== false ? '#7c3aed' : '#6b7280');
    const size = isActive ? 32 : 28;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1.5}" fill="${color}" stroke="white" stroke-width="2" opacity="${opacity}"/>
      <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" font-size="${Math.round(size * 0.45)}" font-weight="bold" fill="white" opacity="${opacity}">${pin.routeOrder}</text>
    </svg>`;
    return {
      url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size / 2),
    };
  }

  // Photo spot → blue diamond
  if (pin.pinType === 'photo') {
    const color = isVisited ? '#9ca3af' : isActive ? '#6d28d9' : '#1d4ed8';
    const size = isActive ? 22 : 18;
    const c = size / 2;
    const r = size / 2 - 1.5;
    const pts = `${c},${c - r} ${c + r},${c} ${c},${c + r} ${c - r},${c}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <polygon points="${pts}" fill="${color}" stroke="white" stroke-width="2" opacity="${opacity}"/>
    </svg>`;
    return {
      url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(c, c),
    };
  }

  // Tourist spot → purple circle
  return {
    path: CIRCLE_PATH,
    scale: isActive ? 11 : 8,
    fillColor: isVisited ? '#9ca3af' : isActive ? '#6d28d9' : '#7c3aed',
    fillOpacity: opacity,
    strokeColor: '#ffffff',
    strokeWeight: 2,
  };
}

function userPositionIcon(heading?: number | null): google.maps.Icon {
  const size = 40;
  const cx = size / 2;
  const cy = size / 2;
  const coneR = 17;
  const halfAngle = 25 * (Math.PI / 180);
  const dotR = 7;

  if (heading != null) {
    // Convert from North=0 clockwise to SVG angle (East=0)
    const rad = (heading - 90) * (Math.PI / 180);
    const x1 = cx + coneR * Math.cos(rad - halfAngle);
    const y1 = cy + coneR * Math.sin(rad - halfAngle);
    const x2 = cx + coneR * Math.cos(rad + halfAngle);
    const y2 = cy + coneR * Math.sin(rad + halfAngle);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <path d="M ${cx},${cy} L ${x1.toFixed(2)},${y1.toFixed(2)} A ${coneR},${coneR} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="rgba(59,130,246,0.25)"/>
      <circle cx="${cx}" cy="${cy}" r="${dotR}" fill="#3b82f6" stroke="white" stroke-width="2"/>
    </svg>`;
    return {
      url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(cx, cy),
    };
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${cx}" cy="${cy}" r="${dotR}" fill="#3b82f6" stroke="white" stroke-width="2"/>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(cx, cy),
  };
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
    return <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">Loading map...</div>;
  }

  const isActive = status !== 'IDLE';
  const hasPhotoPin = attraction.pins.some((p) => p.pinType === 'photo' && !visitedPinIds.includes(p.id));
  const hasSpotPin = attraction.pins.some((p) => p.pinType !== 'photo' && p.bBlock);

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
          zoomControlOptions: { position: 7 },
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
              icon={pinIcon(pin, isActive_, isVisited) as google.maps.Symbol}
              onClick={() => { if (pin.bBlock) triggerPinManual(pin.id); }}
            />
          );
        })}

        {isActive && attraction.pins.map((pin) => {
          if (!pin.bBlock || pin.radius === 0) return null;
          if (visitedPinIds.includes(pin.id)) return null;
          return (
            <Circle
              key={`circle-${pin.id}`}
              center={{ lat: pin.lat, lng: pin.lng }}
              radius={pin.radius}
              options={{ fillColor: '#7c3aed', fillOpacity: 0.07, strokeColor: '#7c3aed', strokeOpacity: 0.3, strokeWeight: 1 }}
            />
          );
        })}

        {userPosition && (
          <Marker
            position={{ lat: userPosition.lat, lng: userPosition.lng }}
            icon={userPositionIcon(userPosition.heading)}
          />
        )}
      </GoogleMap>

      {/* Pin type legend — only shown when relevant pins exist */}
      {(hasPhotoPin || hasSpotPin) && (
        <div className="absolute bottom-16 left-3 bg-white/90 rounded-xl px-3 py-2 shadow-sm flex flex-col gap-1">
          {hasSpotPin && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] shrink-0" />
              <span className="text-xs text-stone-500">Attraction</span>
            </div>
          )}
          {hasPhotoPin && (
            <div className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <polygon points="5,0 10,5 5,10 0,5" fill="#1d4ed8" />
              </svg>
              <span className="text-xs text-stone-500">Photo Spot</span>
            </div>
          )}
        </div>
      )}

      {/* Current location button */}
      {userPosition && (
        <button
          onClick={handleLocateMe}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center active:bg-stone-100 transition-colors"
          aria-label="My location"
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
