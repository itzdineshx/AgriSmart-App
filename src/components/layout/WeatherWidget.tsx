import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, Loader2 } from "lucide-react";
import { fetchWeatherApi } from 'openmeteo';

export function WeatherWidget() {
  const [weather, setWeather] = useState<{
    temperature: number;
    condition: string;
    icon: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      try {
        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                const weatherResponse = await fetchWeatherApi('https://api.open-meteo.com/v1/forecast', {
                  latitude: lat,
                  longitude: lng,
                  current: ['temperature_2m', 'weather_code'],
                  forecast_days: 1
                });

                const response = weatherResponse[0];
                const current = response.current()!;
                
                const temperature = Math.round(current.variables(0)!.value());
                const weatherCode = current.variables(1)!.value();
                
                setWeather({
                  temperature,
                  condition: getWeatherCondition(weatherCode),
                  icon: getWeatherIcon(weatherCode)
                });
                setLoading(false);
              } catch (error) {
                console.error('Weather fetch error:', error);
                setLoading(false);
              }
            },
            () => {
              // Fallback to default location (Delhi)
              setLoading(false);
            }
          );
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Weather error:', error);
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  const getWeatherIcon = (weatherCode: number): string => {
    if (weatherCode === 0) return '☀️';
    if (weatherCode >= 1 && weatherCode <= 3) return '⛅';
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 77) return '🌨️';
    if (weatherCode >= 80 && weatherCode <= 82) return '🌦️';
    if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
    return '🌤️';
  };

  const getWeatherCondition = (weatherCode: number): string => {
    if (weatherCode === 0) return 'Clear';
    if (weatherCode >= 1 && weatherCode <= 3) return 'Cloudy';
    if (weatherCode >= 45 && weatherCode <= 48) return 'Foggy';
    if (weatherCode >= 51 && weatherCode <= 67) return 'Rainy';
    if (weatherCode >= 71 && weatherCode <= 77) return 'Snowy';
    if (weatherCode >= 80 && weatherCode <= 82) return 'Showers';
    if (weatherCode >= 95 && weatherCode <= 99) return 'Thunderstorm';
    return 'Partly Cloudy';
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="h-9 px-2 text-xs">
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    );
  }

  if (!weather) {
    return (
      <Button variant="ghost" size="sm" className="h-9 px-2 text-xs">
        <Cloud className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">N/A</span>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="h-9 px-2 text-xs hover:bg-accent/50">
      <span className="mr-1" style={{ fontSize: '12px' }}>{weather.icon}</span>
      <span className="font-medium">{weather.temperature}°</span>
      <span className="hidden sm:inline ml-1 text-muted-foreground">{weather.condition}</span>
    </Button>
  );
}