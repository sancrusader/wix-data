  'use client';

  import React, { useEffect, useRef, useCallback } from 'react';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { Location } from '@/types/location';

  interface MapComponentProps {
    mapRef: React.RefObject<HTMLDivElement>;
    locations: Location[];
    selectedLocation: Location | null;
    setSelectedLocation: (location: Location | null) => void;
  }

  const MapComponent: React.FC<MapComponentProps> = React.memo(
    ({ mapRef, locations, selectedLocation, setSelectedLocation }) => {
      const mapInstance = useRef<L.Map | null>(null);
      const markersRef = useRef<L.Marker[]>([]);
      

      const createInfoWindowContent = useCallback((location: Location) => {
        return `
          <div class="info-window p-2">
            <h3 class="text-lg font-bold mb-2">${location.name}</h3>
            <p>Volunteer: ${location.volunteer}</p>
            <p>Phone: ${location.phone}</p>
            <p>Date: ${location.date}</p>
            <p>Rumah Rusak Berat: ${location.rumahRusakBerat}</p>
            <p>Rumah Rusak Sedang: ${location.rumahRusakSedang}</p>
            <p>Rumah Rusak Ringan: ${location.rumahRusakRingan}</p>
          </div>
        `;
      }, []);

      useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current) {
          if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, {
              dragging: true,
              scrollWheelZoom: true,
              maxBounds: [[-11.0, 120.0], [-8.0, 126.0]],
              minZoom: 11,
            }).setView([-8.5182, 122.6323], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© Open Street Maps',
            }).addTo(mapInstance.current);
          } else {
            mapInstance.current.invalidateSize();
          }

          // Clear existing markers
          markersRef.current.forEach(marker => marker.remove());
          markersRef.current = [];

          const customIcon = L.icon({
            iconUrl: '/kun.png',
            iconSize: [50, 60],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          locations.forEach((location) => {
            const lat = location.lat;
            const lng = location.lng;

            if (isNaN(lat) || isNaN(lng)) {
              console.error(`Invalid coordinates for location: ${location.name} (Lat: ${lat}, Lng: ${lng})`);
              return;
            }

            if (mapInstance.current) {
              const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance.current);
              const popup = L.popup().setContent(createInfoWindowContent(location));

              marker.bindPopup(popup);
              marker.bindTooltip(location.name, { permanent: false, direction: 'top' });

              marker.on('click', () => {
                setSelectedLocation(location);
                marker.openPopup();
              });

              marker.on('dblclick', () => {
                setSelectedLocation(null);
              });

              // Highlight selected marker
              if (selectedLocation && selectedLocation.name === location.name) {
                marker.setIcon(L.icon({
                  iconUrl: '/kun.png', // Change to a different icon for the selected marker
                  iconSize: [50, 60],
                  iconAnchor: [20, 40],
                  popupAnchor: [0, -40],
                }));
              }

              markersRef.current.push(marker);
            }
          });
        }

        return () => {
          if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
          }
        };
      }, [locations, mapRef, createInfoWindowContent, selectedLocation, setSelectedLocation]);

      return null;
    }
  );

  export default MapComponent;