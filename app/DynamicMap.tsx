'use client'

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { Location } from '@/types/location'

interface DynamicMapProps {
  locations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const DynamicMap: React.FC<DynamicMapProps> = ({ locations, setSelectedLocation }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const MapComponent = dynamic(
    () => import('./MapComponent'),
    { 
      loading: () => <p>Loading map...</p>,
      ssr: false
    }
  );

  return (
    <div ref={mapRef} className="w-full h-[400px] lg:h-[600px] rounded-lg mb-4">
      <MapComponent 
        mapRef={mapRef}
        locations={locations}
        setSelectedLocation={setSelectedLocation}
      />
      
    </div>
  );
};

export default DynamicMap;