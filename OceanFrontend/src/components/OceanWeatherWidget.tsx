import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

interface OceanWeatherWidgetProps {
  lat: number;
  lng: number;
  hazardType?: string;
}

interface WeatherData {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  };
  temperature: {
    current: number;
    feelsLike: number;
  };
  wind: {
    speed: number;
    compassDirection: string;
  };
  seaConditions: {
    condition: string;
    waveHeightRange: string;
    description: string;
  };
  humidity: number;
  visibility: number;
}

export const OceanWeatherWidget: React.FC<OceanWeatherWidgetProps> = ({ lat, lng, hazardType }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.getOceanWeather(lat, lng);
      setWeather(response.data);
    } catch (err) {
      console.error('Error fetching ocean weather:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 border border-slate-700 w-80">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg p-4 border border-slate-700 w-80">
        <p className="text-slate-400 text-sm">Weather data unavailable</p>
      </div>
    );
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getConditionColor = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('storm') || c.includes('gale')) return 'text-red-400';
    if (c.includes('fresh') || c.includes('strong')) return 'text-orange-400';
    if (c.includes('moderate')) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 w-80 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600/20 border-b border-slate-700 p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center space-x-2">
            <span>🌊</span>
            <span>Ocean Conditions</span>
          </h3>
          <button onClick={fetchWeather} className="text-slate-400 hover:text-white">
            🔄
          </button>
        </div>
      </div>

      {/* Weather Info */}
      <div className="p-4 space-y-3">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-white">{weather.temperature.current}°C</div>
            <div className="text-sm text-slate-400 capitalize">{weather.weather.description}</div>
          </div>
          <img 
            src={getWeatherIcon(weather.weather.icon)} 
            alt={weather.weather.description}
            className="w-16 h-16"
          />
        </div>

        {/* Sea Conditions */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 uppercase">Sea State</span>
            <span className={`text-sm font-bold ${getConditionColor(weather.seaConditions.condition)}`}>
              {weather.seaConditions.condition}
            </span>
          </div>
          <div className="text-xs text-slate-300">{weather.seaConditions.description}</div>
          <div className="text-xs text-slate-400 mt-1">Wave Height: {weather.seaConditions.waveHeightRange}</div>
        </div>

        {/* Wind */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-slate-400 mb-1">💨 Wind</div>
            <div className="text-lg font-bold text-white">{weather.wind.speed} km/h</div>
            <div className="text-xs text-slate-400">{weather.wind.compassDirection}</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-slate-400 mb-1">💧 Humidity</div>
            <div className="text-lg font-bold text-white">{weather.humidity}%</div>
            <div className="text-xs text-slate-400">Moisture</div>
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">👁️ Visibility</span>
            <span className="text-sm font-bold text-white">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
        </div>

        {hazardType && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
            <p className="text-xs text-yellow-300">
              ⚠️ Reported Hazard: <span className="font-bold">{hazardType}</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900/50 border-t border-slate-700 px-4 py-2">
        <p className="text-xs text-slate-500 text-center">
          Powered by OpenWeatherMap
        </p>
      </div>
    </div>
  );
};
