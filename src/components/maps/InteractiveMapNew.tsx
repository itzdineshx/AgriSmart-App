import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Target, Search, Layers, Navigation, MapPin, Zap } from 'lucide-react';

// Fix Leaflet's default marker path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Default coordinates for Punjab, India
const PUNJAB_CENTER = {
  lat: 31.1471,
  lng: 75.3412,
  zoom: 8
};

// Sample agricultural data points
const SAMPLE_FARMS = [
  { id: 1, name: "Green Valley Farm", lat: 31.2547, lng: 75.7013, type: "organic", status: "healthy" },
  { id: 2, name: "Sunrise Agriculture", lat: 30.9010, lng: 75.8573, type: "traditional", status: "warning" },
  { id: 3, name: "Tech Farm Solutions", lat: 31.4832, lng: 74.9482, type: "hydroponic", status: "excellent" },
];

// LocationMarker component to handle marker positioning and map updates
const LocationMarker: React.FC<{
  position: L.LatLngExpression;
  isUserLocation: boolean;
}> = ({ position, isUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position as L.LatLngExpression, isUserLocation ? 13 : PUNJAB_CENTER.zoom, {
      animate: true,
      duration: 1.5
    });
  }, [map, position, isUserLocation]);

  return (
    <Marker position={position}>
      <Popup>
        <div className="text-center">
          <strong>{isUserLocation ? "📍 You are here" : "📍 Default Location"}</strong>
          <p className="text-sm text-muted-foreground mt-1">
            {isUserLocation ? "Current Location" : "Punjab, India"}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

// Farm markers component
const FarmMarkers: React.FC = () => {
  const getMarkerIcon = (type: string, status: string) => {
    const color = status === 'excellent' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#6366f1';
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color}; 
          border: 3px solid white; 
          border-radius: 50%; 
          width: 20px; 
          height: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `,
      className: 'farm-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <>
      {SAMPLE_FARMS.map((farm) => (
        <Marker 
          key={farm.id} 
          position={[farm.lat, farm.lng]}
          icon={getMarkerIcon(farm.type, farm.status)}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-sm mb-2">{farm.name}</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <Badge variant="outline" className="text-xs">
                    {farm.type}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={farm.status === 'excellent' ? 'default' : farm.status === 'warning' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {farm.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export const InteractiveMapNew: React.FC = () => {
  const [position, setPosition] = useState<L.LatLngExpression>([PUNJAB_CENTER.lat, PUNJAB_CENTER.lng]);
  const [isUserLocation, setIsUserLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFarms, setShowFarms] = useState(true);

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        setIsUserLocation(true);
        setIsLoading(false);
      },
      (error) => {
        console.log('Error getting location:', error);
        setPosition([PUNJAB_CENTER.lat, PUNJAB_CENTER.lng]);
        setIsUserLocation(false);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for search functionality
    console.log('Searching for:', searchQuery);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="relative w-full">
      {/* Enhanced Control Panel */}
      <Card className="absolute top-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm border-border/50 shadow-lg max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Map Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs h-8"
            />
            <Button type="submit" size="sm" variant="outline" className="h-8 px-2">
              <Search className="h-3 w-3" />
            </Button>
          </form>

          {/* Layer Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Show Farms</span>
            <Button
              variant={showFarms ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFarms(!showFarms)}
              className="h-7 px-2 text-xs"
            >
              <Layers className="h-3 w-3 mr-1" />
              {showFarms ? 'On' : 'Off'}
            </Button>
          </div>

          {/* Location Status */}
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${isUserLocation ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-muted-foreground">
              {isUserLocation ? 'Location detected' : 'Using default location'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Map Container with Enhanced Styling */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg border border-border/20">
        <MapContainer
          center={position}
          zoom={PUNJAB_CENTER.zoom}
          className="w-full h-full"
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          <LocationMarker position={position} isUserLocation={isUserLocation} />
          {showFarms && <FarmMarkers />}
        </MapContainer>
      </div>

      {/* Enhanced Floating Controls */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Locate Me Button */}
        <Button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="bg-background/95 backdrop-blur-sm border border-border/50 text-foreground hover:bg-accent/80 shadow-lg"
          size="sm"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Locate Me
            </>
          )}
        </Button>

        {/* Navigation Button */}
        <Button
          variant="outline"
          size="sm"
          className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg"
          onClick={() => console.log('Navigate')}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Navigate
        </Button>
      </div>

      {/* Stats Overlay */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Healthy: {SAMPLE_FARMS.filter(f => f.status === 'excellent').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-muted-foreground">Warning: {SAMPLE_FARMS.filter(f => f.status === 'warning').length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-500" />
                <span className="text-muted-foreground">Live Data</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};