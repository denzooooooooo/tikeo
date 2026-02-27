'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, X, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  url?: string;
  color?: string;
  icon?: string;
}

export interface MapViewProps {
  markers?: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  showUserLocation?: boolean;
  interactive?: boolean;
  className?: string;
}

const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 }; // Paris

export function MapView({
  markers = [],
  center = DEFAULT_CENTER,
  zoom = 12,
  height = '400px',
  onMarkerClick,
  onMapClick,
  showUserLocation = false,
  interactive = true,
  className = '',
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Simulate map loading (would be real Leaflet/Mapbox in production)
  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get user location
  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, [showUserLocation]);

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 1, 1));
  };

  const handleCenterOnUser = () => {
    if (userLocation) {
      setCurrentZoom(15);
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  const getMarkerColor = (marker: MapMarker) => {
    if (marker.color) return marker.color;
    
    // Different colors based on marker type
    if (marker.icon === '🎵') return '#8B5CF6'; // Music - Purple
    if (marker.icon === '⚽') return '#10B981'; // Sports - Green
    if (marker.icon === '🎭') return '#F59E0B'; // Arts - Yellow
    if (marker.icon === '💻') return '#3B82F6'; // Tech - Blue
    return '#EF4444'; // Default Red
  };

  return (
    <div 
      ref={mapRef}
      className={`relative rounded-xl overflow-hidden bg-gray-100 ${className}`}
      style={{ height }}
    >
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * (currentZoom / 12)}px ${20 * (currentZoom / 12)}px`,
        }}
      />

      {/* Simulated map content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <MapPin className="h-16 w-16 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Carte interactive</p>
          <p className="text-xs opacity-75">
            {markers.length} marqueur{markers.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Markers */}
      {markers.map((marker) => (
        <button
          key={marker.id}
          onClick={() => handleMarkerClick(marker)}
          className="absolute transform -translate-x-1/2 -translate-y-full hover:z-10 transition-transform hover:scale-110"
          style={{
            left: `${((marker.lng - (center.lng - 0.1)) / 0.2) * 100}%`,
            top: `${((center.lat + 0.05 - marker.lat) / 0.1) * 100}%`,
          }}
        >
          <div 
            className="relative flex flex-col items-center"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transform transition-all hover:scale-110"
              style={{ backgroundColor: getMarkerColor(marker) }}
            >
              <span className="text-lg">{marker.icon || '📍'}</span>
            </div>
            <div 
              className="w-2 h-2 rotate-45 -mt-1"
              style={{ backgroundColor: getMarkerColor(marker) }}
            />
          </div>
        </button>
      ))}

      {/* User Location */}
      {userLocation && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${((userLocation.lng - (center.lng - 0.1)) / 0.2) * 100}%`,
            top: `${((center.lat + 0.05 - userLocation.lat) / 0.1) * 100}%`,
          }}
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-50" />
          </div>
        </div>
      )}

      {/* Selected Marker Info */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{selectedMarker.title}</h3>
              {selectedMarker.description && (
                <p className="text-sm text-gray-600 mt-1">{selectedMarker.description}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          {selectedMarker.url && (
            <Link
              href={selectedMarker.url}
              className="inline-flex items-center gap-1 mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Voir les détails →
            </Link>
          )}
        </div>
      )}

      {/* Controls */}
      {interactive && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Zoom +"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            title="Zoom -"
          >
            <ZoomOut className="h-5 w-5 text-gray-700" />
          </button>
          {showUserLocation && (
            <button
              onClick={handleCenterOnUser}
              className={`w-10 h-10 rounded-lg shadow-md flex items-center justify-center transition-colors ${
                userLocation ? 'bg-blue-500 hover:bg-blue-600' : 'bg-white hover:bg-gray-50'
              }`}
              title="Ma position"
            >
              <Navigation className={`h-5 w-5 ${userLocation ? 'text-white' : 'text-gray-700'}`} />
            </button>
          )}
        </div>
      )}

      {/* Zoom Level */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs text-gray-600">
        Zoom: {currentZoom}x
      </div>

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Chargement de la carte...</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact map for cards
export interface CompactMapProps {
  latitude?: number;
  longitude?: number;
  venueName?: string;
  className?: string;
}

export function CompactMap({ latitude, longitude, venueName, className = '' }: CompactMapProps) {
  const hasLocation = latitude && longitude;

  return (
    <div 
      className={`relative rounded-lg overflow-hidden bg-gray-100 ${className}`}
      style={{ height: '150px' }}
    >
      {hasLocation ? (
        <>
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '15px 15px',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-purple-500" />
              {venueName && (
                <span className="text-xs text-gray-600 mt-1 text-center px-2 truncate max-w-[150px]">
                  {venueName}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Lieu non défini</span>
        </div>
      )}
    </div>
  );
}

export default MapView;

