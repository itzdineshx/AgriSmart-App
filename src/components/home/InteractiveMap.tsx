import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Layers, Navigation, Maximize2, Search, Target, Eye, EyeOff, Mic } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockData } from "@/data/mockData";
import { useWeather } from "@/hooks/useWeather";
import { getWeatherData } from "@/services/weatherService";
import { generateAISuggestions } from "@/services/geminiService";
import { toast } from "sonner";

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
  const [visibleLayers, setVisibleLayers] = useState({
    weather: true,
    crops: true,
    market: true,
    alerts: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [weatherLayer, setWeatherLayer] = useState<L.TileLayer | null>(null);
  const { weatherData } = useWeather();

  // Load AI suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const farmerProfile = {
          name: "Rajesh Kumar",
          crops: ["rice", "tomato"],
          location: mockData.farmer.location,
          farmSize: mockData.farmer.farmSize
        };
        
        const suggestions = await generateAISuggestions(
          farmerProfile,
          weatherData?.current,
          mockData.cropHealth,
          mockData.marketPrices
        );
        setAiSuggestions(suggestions.map(s => s.description));
      } catch (error) {
        console.error('Failed to load AI suggestions:', error);
      }
    };
    
    if (weatherData) {
      loadSuggestions();
    }
  }, [weatherData]);

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

    // Add weather overlay layer
    const weatherTileLayer = L.tileLayer(
      `https://api.openweathermap.org/data/2.5/weather/lat={lat}&lon={lon}&appid=demo`,
      {
        attribution: '© OpenWeatherMap',
        opacity: 0.6
      }
    );
    setWeatherLayer(weatherTileLayer);

    mapInstanceRef.current = map;

    // Add farm plots
    const farmMarkers: L.Marker[] = [];
    mockData.farmPlots.forEach((plot) => {
      const icon = L.divIcon({
        html: `<div style="background: ${plot.health > 80 ? '#22c55e' : plot.health > 60 ? '#f59e0b' : '#ef4444'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">🌾</div>`,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(plot.coordinates as [number, number], { icon })
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold">${plot.name}</h3>
            <p class="text-sm text-gray-600">Crop: ${plot.crop}</p>
            <p class="text-sm text-gray-600">Area: ${plot.area}</p>
            <p class="text-sm">Health: <span class="font-medium" style="color: ${plot.health > 80 ? '#22c55e' : plot.health > 60 ? '#f59e0b' : '#ef4444'}">${plot.health}%</span></p>
            ${plot.issues.length > 0 ? `<p class="text-sm text-red-600">Issues: ${plot.issues.join(', ')}</p>` : ''}
          </div>
        `);
      
      farmMarkers.push(marker);
      if (visibleLayers.crops) marker.addTo(map);
    });

    // Add market markers
    const marketMarkers: L.Marker[] = [];
    mockData.nearbyMarkets.forEach((market) => {
      const icon = L.divIcon({
        html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">🛒</div>',
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(market.coordinates as [number, number], { icon })
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
      
      marketMarkers.push(marker);
      if (visibleLayers.market) marker.addTo(map);
    });

    // Add disease outbreak areas
    const alertCircles: L.Circle[] = [];
    mockData.diseaseOutbreaks.forEach((outbreak) => {
      const circle = L.circle(outbreak.coordinates as [number, number], {
        radius: outbreak.radius * 1000, // Convert km to meters
        color: outbreak.severity === 'high' ? '#ef4444' : '#f59e0b',
        fillColor: outbreak.severity === 'high' ? '#ef4444' : '#f59e0b',
        fillOpacity: 0.2,
        weight: 2
      });

      circle.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-red-600">⚠️ ${outbreak.name}</h3>
          <p class="text-sm text-gray-600">Crop: ${outbreak.crop}</p>
          <p class="text-sm text-gray-600">Severity: ${outbreak.severity}</p>
          <p class="text-sm text-gray-600">Affected farms: ${outbreak.affectedFarms}</p>
          <p class="text-sm text-gray-600">Radius: ${outbreak.radius}km</p>
        </div>
      `);
      
      alertCircles.push(circle);
      if (visibleLayers.alerts) circle.addTo(map);
    });

    // Store references for layer toggling
    (map as any)._farmMarkers = farmMarkers;
    (map as any)._marketMarkers = marketMarkers;
    (map as any)._alertCircles = alertCircles;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle layer visibility changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    const farmMarkers = (map as any)._farmMarkers || [];
    const marketMarkers = (map as any)._marketMarkers || [];
    const alertCircles = (map as any)._alertCircles || [];

    // Toggle farm markers
    farmMarkers.forEach((marker: L.Marker) => {
      if (visibleLayers.crops) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });

    // Toggle market markers
    marketMarkers.forEach((marker: L.Marker) => {
      if (visibleLayers.market) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });

    // Toggle alert circles
    alertCircles.forEach((circle: L.Circle) => {
      if (visibleLayers.alerts) {
        circle.addTo(map);
      } else {
        map.removeLayer(circle);
      }
    });

    // Toggle weather layer
    if (weatherLayer) {
      if (visibleLayers.weather) {
        weatherLayer.addTo(map);
      } else {
        map.removeLayer(weatherLayer);
      }
    }
  }, [visibleLayers, weatherLayer]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          toast.success("Location updated");
        }
      }, () => {
        toast.error("Could not get your location");
      });
    } else {
      toast.error("Geolocation is not supported");
    }
  };

  const handleSearch = (query: string) => {
    // Simple search functionality for crops and locations
    const results = mockData.farmPlots.filter(plot => 
      plot.name.toLowerCase().includes(query.toLowerCase()) ||
      plot.crop.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.setView(results[0].coordinates as [number, number], 15);
      toast.success(`Found ${results.length} result(s)`);
    } else {
      toast.error("No results found");
    }
  };

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const MapContent = () => (
    <div className="relative">
      <div ref={mapRef} className="w-full h-64 rounded-lg" />
      
      {/* Search Bar */}
      <div className="absolute top-2 left-2 flex gap-2">
        <div className="flex items-center bg-background/90 backdrop-blur-sm rounded-lg border">
          <Input
            placeholder="Search crops, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="border-0 bg-transparent text-xs w-40"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleSearch(searchQuery)}
            className="h-8 px-2"
          >
            <Search className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2"
          >
            <Mic className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={getCurrentLocation}
          className="bg-background/90 backdrop-blur-sm"
          title="Get Current Location"
        >
          <Target className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          className="bg-background/90 backdrop-blur-sm"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Layer Controls */}
      <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={visibleLayers.weather ? 'default' : 'ghost'}
            onClick={() => toggleLayer('weather')}
            className="text-xs px-2"
            title="Weather Layer"
          >
            {visibleLayers.weather ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant={visibleLayers.crops ? 'default' : 'ghost'}
            onClick={() => toggleLayer('crops')}
            className="text-xs px-2"
            title="Crops Layer"
          >
            🌾
          </Button>
          <Button
            size="sm"
            variant={visibleLayers.market ? 'default' : 'ghost'}
            onClick={() => toggleLayer('market')}
            className="text-xs px-2"
            title="Markets Layer"
          >
            🛒
          </Button>
          <Button
            size="sm"
            variant={visibleLayers.alerts ? 'default' : 'ghost'}
            onClick={() => toggleLayer('alerts')}
            className="text-xs px-2"
            title="Alerts Layer"
          >
            ⚠️
          </Button>
        </div>
      </div>

      {/* Weather Info */}
      {weatherData && (
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center gap-2 text-xs">
            <span>🌤️</span>
            <span>{Math.round(weatherData.current.temperature_2m)}°C</span>
            <span className="text-muted-foreground">Clear</span>
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="absolute bottom-16 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-3 max-w-xs">
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-1">
            🤖 Smart Suggestions
          </h4>
          {aiSuggestions.slice(0, 2).map((suggestion, index) => (
            <p key={index} className="text-xs text-muted-foreground mb-1">
              • {suggestion}
            </p>
          ))}
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