"use client";
import React, { useEffect, useState } from 'react';

interface MapLoaderProps {
  children: React.ReactNode;
  mapType: 'leaflet' | 'mapbox';
}

export default function MapLoader({ children, mapType }: MapLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMapLibrary = async () => {
      try {
        if (mapType === 'leaflet') {
          // Load Leaflet
          if (!window.L) {
            const L = await import('leaflet');
            try {
              // CSS is already imported via global styles
              console.log('Leaflet CSS will be loaded via global styles');
            } catch (cssError) {
              console.warn('Could not import Leaflet CSS:', cssError);
            }
            (window as unknown as Window & Record<string, unknown>).L = L.default;
          }
        } else if (mapType === 'mapbox') {
          // Load Mapbox
          if (!window.mapboxgl) {
            const mapboxgl = await import('mapbox-gl');
            try {
              // CSS is already imported via global styles
              console.log('Mapbox CSS will be loaded via global styles');
            } catch (cssError) {
              console.warn('Could not import Mapbox CSS:', cssError);
            }
            (window as unknown as Window & Record<string, unknown>).mapboxgl = mapboxgl.default;
          }
        }
        
        setIsLoaded(true);
      } catch (err) {
        console.error(`Failed to load ${mapType}:`, err);
        setError(`Không thể tải thư viện ${mapType}`);
      }
    };

    loadMapLibrary();
  }, [mapType]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-red-500 text-xl mb-4">⚠️ Lỗi tải bản đồ</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Đang tải {mapType === 'leaflet' ? 'Leaflet' : 'Mapbox'}...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}