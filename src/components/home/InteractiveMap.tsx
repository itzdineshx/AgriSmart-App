import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Layers, Navigation, Maximize2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockData } from "@/data/mockData";
import { useWeather } from "@/hooks/useWeather";

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFyaXNod2FyYW4iLCJhIjoiY21hZHhwZGs2MDF4YzJxczh2aDd0cWg1MyJ9.qcu0lpqVlZlC2WFxhwb1Pg';

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'weather' | 'crops' | 'market' | 'alerts'>('crops');
  const { weatherData } = useWeather();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(mockData.farmer.coordinates as [number, number], 12);

    // Add Mapbox tile layer
    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, {
      attribution: '© Mapbox © OpenStreetMap',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add farm plots
    mockData.farmPlots.forEach((plot) => {
      const icon = L.divIcon({
        html: `<div style="background: ${plot.health > 80 ? '#22c55e' : plot.health > 60 ? '#f59e0b' : '#ef4444'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">🌾</div>`,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker(plot.coordinates as [number, number], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${plot.name}</h3>
            <p class="text-sm text-gray-600">Crop: ${plot.crop}</p>
            <p class="text-sm text-gray-600">Area: ${plot.area}</p>
            <p class="text-sm">Health: <span class="font-medium" style="color: ${plot.health > 80 ? '#22c55e' : plot.health > 60 ? '#f59e0b' : '#ef4444'}">${plot.health}%</span></p>
            ${plot.issues.length > 0 ? `<p class="text-sm text-red-600">Issues: ${plot.issues.join(', ')}</p>` : ''}
          </div>
        `);
    });

    // Add market markers
    mockData.nearbyMarkets.forEach((market) => {
      const icon = L.divIcon({
        html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">🛒</div>',
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker(market.coordinates as [number, number], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${market.name}</h3>
            <p class="text-sm text-gray-600">Distance: ${market.distance}</p>
            <div class="mt-2 space-y-1">
              ${Object.entries(market.prices).map(([crop, price]) => 
                `<p class="text-sm">${crop}: ₹${price}</p>`
              ).join('')}
            </div>
          </div>
        `);
    });

    // Add disease outbreak areas
    mockData.diseaseOutbreaks.forEach((outbreak) => {
      const circle = L.circle(outbreak.coordinates as [number, number], {
        radius: outbreak.radius * 1000, // Convert km to meters
        color: outbreak.severity === 'high' ? '#ef4444' : '#f59e0b',
        fillColor: outbreak.severity === 'high' ? '#ef4444' : '#f59e0b',
        fillOpacity: 0.2,
        weight: 2
      }).addTo(map);

      circle.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-red-600">⚠️ ${outbreak.name}</h3>
          <p class="text-sm text-gray-600">Crop: ${outbreak.crop}</p>
          <p class="text-sm text-gray-600">Severity: ${outbreak.severity}</p>
          <p class="text-sm text-gray-600">Affected farms: ${outbreak.affectedFarms}</p>
          <p class="text-sm text-gray-600">Radius: ${outbreak.radius}km</p>
        </div>
      `);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const MapContent = () => (
    <div className="relative">
      <div ref={mapRef} className="w-full h-64 rounded-lg" />
      
      {/* Map Controls */}
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 space-y-1">
        <Button
          size="sm"
          variant={activeLayer === 'crops' ? 'default' : 'ghost'}
          onClick={() => setActiveLayer('crops')}
          className="w-full justify-start text-xs"
        >
          🌾 Crops
        </Button>
        <Button
          size="sm"
          variant={activeLayer === 'market' ? 'default' : 'ghost'}
          onClick={() => setActiveLayer('market')}
          className="w-full justify-start text-xs"
        >
          🛒 Markets
        </Button>
        <Button
          size="sm"
          variant={activeLayer === 'alerts' ? 'default' : 'ghost'}
          onClick={() => setActiveLayer('alerts')}
          className="w-full justify-start text-xs"
        >
          ⚠️ Alerts
        </Button>
      </div>

      {/* Fullscreen Toggle */}
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      {/* Weather Overlay Info */}
      {weatherData && (
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center gap-2 text-xs">
            <span>🌤️</span>
            <span>{Math.round(weatherData.current.temperature_2m)}°C</span>
            <span className="text-muted-foreground">Clear</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="px-4 py-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Farm Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapContent />
            
            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                🌾 Farm Plots
              </Badge>
              <Badge variant="outline" className="text-xs">
                🛒 Markets
              </Badge>
              <Badge variant="outline" className="text-xs">
                ⚠️ Disease Alerts
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fullscreen Map Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Farm Map
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <div ref={mapRef} className="w-full h-full rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}