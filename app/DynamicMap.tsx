'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { Location } from '@/types/location'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from 'lucide-react'

interface DynamicMapProps {
  locations: Location[]
  setSelectedLocation: (location: Location | null) => void
}

const DynamicMap: React.FC<DynamicMapProps> = ({ locations, setSelectedLocation }) => {
  const mapRef = useRef<HTMLDivElement | null>(null)

  const MapComponent = dynamic(
    () => import('./MapComponent'),
    { 
      loading: () => <MapLoadingState />,
      ssr: false
    }
  )

  return (
    <div ref={mapRef} className="w-full h-[400px] lg:h-[600px] rounded-lg mb-4 overflow-hidden">
      <MapComponent 
        mapRef={mapRef}
        locations={locations}
        selectedLocation={null}
        setSelectedLocation={setSelectedLocation}
      />
    </div>
  )
}

const MapLoadingState: React.FC = () => {
  return (
    <Card className="w-full h-full flex items-center justify-center bg-muted/50">
      <CardContent className="flex flex-col items-center gap-4">
        <MapPin className="h-12 w-12 text-muted-foreground animate-pulse" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  )
}

export default DynamicMap