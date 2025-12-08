import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface OceanWeatherData {
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
    min: number;
    max: number;
  };
  wind: {
    speed: number;
    direction: number;
    gust?: number;
  };
  waves?: {
    height: number;
    direction: number;
    period: number;
  };
  visibility: number;
  humidity: number;
  pressure: number;
  timestamp: string;
}

export const getOceanWeather = async (lat: number, lng: number): Promise<OceanWeatherData | null> => {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.warn('OpenWeatherMap API key not configured');
      return null;
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon: lng,
        appid: OPENWEATHER_API_KEY,
        units: 'metric' 
      }
    });

    const data = response.data;

    return {
      location: {
        lat,
        lng,
        name: data.name || 'Ocean Location'
      },
      weather: {
        description: data.weather[0]?.description || 'Unknown',
        icon: data.weather[0]?.icon || '01d',
        main: data.weather[0]?.main || 'Clear'
      },
      temperature: {
        current: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max)
      },
      wind: {
        speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        direction: data.wind.deg,
        gust: data.wind.gust ? Math.round(data.wind.gust * 3.6) : undefined
      },
      visibility: data.visibility || 10000,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error fetching ocean weather:', error.message);
    return null;
  }
};




export const getMarineForecast = async (lat: number, lng: number): Promise<any> => {
  try {
    if (!OPENWEATHER_API_KEY) {
      console.warn('OpenWeatherMap API key not configured');
      return null;
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon: lng,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: 8 // Next 24 hours (8 * 3-hour intervals)
      }
    });

    const forecasts = response.data.list.map((item: any) => ({
      timestamp: item.dt_txt,
      temperature: Math.round(item.main.temp),
      weather: item.weather[0]?.description,
      windSpeed: Math.round(item.wind.speed * 3.6),
      windDirection: item.wind.deg,
      humidity: item.main.humidity,
      rain: item.rain?.['3h'] || 0
    }));

    return {
      location: { lat, lng },
      forecasts
    };
  } catch (error: any) {
    console.error('Error fetching marine forecast:', error.message);
    return null;
  }
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};




export const getSeaConditions = (windSpeedKmh: number): {
  condition: string;
  waveHeightRange: string;
  description: string;
} => {
  if (windSpeedKmh < 6) {
    return {
      condition: 'Calm',
      waveHeightRange: '0-0.1m',
      description: 'Sea like a mirror'
    };
  } else if (windSpeedKmh < 12) {
    return {
      condition: 'Light Air',
      waveHeightRange: '0.1-0.2m',
      description: 'Ripples without crests'
    };
  } else if (windSpeedKmh < 20) {
    return {
      condition: 'Light Breeze',
      waveHeightRange: '0.2-0.5m',
      description: 'Small wavelets'
    };
  } else if (windSpeedKmh < 29) {
    return {
      condition: 'Gentle Breeze',
      waveHeightRange: '0.5-1m',
      description: 'Large wavelets, some crests'
    };
  } else if (windSpeedKmh < 39) {
    return {
      condition: 'Moderate Breeze',
      waveHeightRange: '1-2m',
      description: 'Small waves, frequent white horses'
    };
  } else if (windSpeedKmh < 50) {
    return {
      condition: 'Fresh Breeze',
      waveHeightRange: '2-3m',
      description: 'Moderate waves, many white horses'
    };
  } else if (windSpeedKmh < 62) {
    return {
      condition: 'Strong Breeze',
      waveHeightRange: '3-4m',
      description: 'Large waves, white foam crests'
    };
  } else if (windSpeedKmh < 75) {
    return {
      condition: 'Near Gale',
      waveHeightRange: '4-5.5m',
      description: 'Sea heaps up, foam streaks'
    };
  } else if (windSpeedKmh < 89) {
    return {
      condition: 'Gale',
      waveHeightRange: '5.5-7.5m',
      description: 'High waves, dense foam'
    };
  } else {
    return {
      condition: 'Storm',
      waveHeightRange: '7.5m+',
      description: 'Very high waves, dangerous conditions'
    };
  }
};
