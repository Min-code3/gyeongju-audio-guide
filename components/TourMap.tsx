'use client';

import { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Attraction } from '@/lib/types';

interface TourMapProps {
  attractions: Attraction[];
  center: { lat: number; lng: number };
  defaultZoom: number;
  selectedId: string | null;
}

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f0e8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e8f5' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e9c7' }] },
];

const CIRCLE = 0 as unknown as google.maps.SymbolPath;

export default function TourMap({ attractions, center, defaultZoom, selectedId }: TourMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  // Pan to selected attraction
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const attraction = attractions.find((a) => a.id === selectedId);
    if (attraction) {
      mapRef.current.panTo(attraction.center);
      mapRef.current.setZoom(attraction.defaultZoom);
    }
  }, [selectedId, attractions]);

  if (!isLoaded) {
    return <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-sm">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={defaultZoom}
      options={{
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy',
      }}
      onLoad={(map) => { mapRef.current = map; }}
    >
      {attractions.map((attraction) => (
        <Marker
          key={attraction.id}
          position={attraction.center}
          label={{
            text: attraction.name,
            fontSize: '11px',
            fontWeight: attraction.id === selectedId ? 'bold' : 'normal',
            color: '#1c1917',
          }}
          icon={{
            path: CIRCLE,
            scale: attraction.id === selectedId ? 11 : 8,
            fillColor: attraction.id === selectedId ? '#d97706' : '#1d4ed8',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />
      ))}
    </GoogleMap>
  );
}
