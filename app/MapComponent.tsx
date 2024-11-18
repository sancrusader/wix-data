'use client'

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/location'

interface MapComponentProps {
  mapRef: React.RefObject<HTMLDivElement>;
  locations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ mapRef, locations, setSelectedLocation }) => {
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
        }).setView([-8.182946, 123.037949], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© Open Street Maps'
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

      const markers = locations.map((location) => {
        const lat = location.lat;
        const lng = location.lng;

        if (isNaN(lat) || isNaN(lng)) {
          console.error(`Invalid coordinates for location: ${location.name} (Lat: ${lat}, Lng: ${lng})`);
          return null;
        }

        if (mapInstance.current) {
          const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance.current);
          const popup = L.popup().setContent(createInfoWindowContent(location));
          
          marker.bindPopup(popup);

          marker.on('click', () => {
            setSelectedLocation(location); // Simpan lokasi yang dipilih di state lokal
            marker.openPopup(); // Buka popup
          });
          markersRef.current.push(marker);
          return marker;
        }

        return null;
      }).filter((marker): marker is L.Marker => marker !== null);

      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        mapInstance.current.fitBounds(group.getBounds());
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [locations, mapRef, createInfoWindowContent, setSelectedLocation]);

  return null;
};

export default MapComponent;