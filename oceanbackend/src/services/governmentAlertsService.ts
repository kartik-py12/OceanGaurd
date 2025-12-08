import axios from 'axios';

interface NOAAAlert {
  id: string;
  type: string;
  properties: {
    event: string;
    severity: string;
    certainty: string;
    urgency: string;
    headline: string;
    description: string;
    instruction?: string;
    areaDesc: string;
    onset: string;
    expires: string;
  };
}

interface USGSEarthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    tsunami: number;
    title: string;
  };
  geometry: {
    coordinates: [number, number, number]; // [lng, lat, depth]
  };
}

interface ProcessedAlert {
  id: string;
  type: 'weather' | 'tsunami' | 'earthquake';
  source: 'NOAA' | 'USGS';
  title: string;
  severity: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  expiresAt?: string;
  url?: string;
  instruction?: string;
}

export const getNOAAAlerts = async (): Promise<ProcessedAlert[]> => {
  try {
    const response = await axios.get<{ features: NOAAAlert[] }>(
      'https://api.weather.gov/alerts/active?message_type=alert',
      {
        headers: {
          'User-Agent': 'OceanGuard-App/1.0 (contact@oceanguard.com)'
        }
      }
    );

    if (!response.data || !response.data.features) {
      return [];
    }
    const marineKeywords = ['marine', 'coastal', 'ocean', 'tsunami', 'beach', 'surf', 'rip current', 'storm surge', 'hurricane', 'tropical'];

    const alerts = response.data.features
      .filter(alert => {
        const event = alert.properties.event.toLowerCase();
        const desc = alert.properties.description.toLowerCase();
        const area = alert.properties.areaDesc.toLowerCase();

        return marineKeywords.some(keyword =>
          event.includes(keyword) || desc.includes(keyword) || area.includes(keyword)
        );
      })
      .map(alert => ({
        id: alert.id,
        type: alert.properties.event.toLowerCase().includes('tsunami') ? 'tsunami' as const : 'weather' as const,
        source: 'NOAA' as const,
        title: alert.properties.event,
        severity: alert.properties.severity || 'Unknown',
        description: alert.properties.headline || alert.properties.description,
        location: alert.properties.areaDesc,
        timestamp: alert.properties.onset || new Date().toISOString(),
        expiresAt: alert.properties.expires,
        instruction: alert.properties.instruction,
      }))
      .slice(0, 20); // Limit to 20 most recent

    return alerts;
  } catch (error: any) {
    console.error('Error fetching NOAA alerts:', error.message);
    return [];
  }
};

export const getUSGSEarthquakes = async (): Promise<ProcessedAlert[]> => {
  try {
    const response = await axios.get<{ features: USGSEarthquake[] }>(
      'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4.5&limit=50&orderby=time',
      {
        headers: {
          'User-Agent': 'OceanGuard-App/1.0'
        }
      }
    );

    if (!response.data || !response.data.features) {
      return [];
    }

    const earthquakes = response.data.features
      .filter(eq => {
        const depth = eq.geometry.coordinates[2];
        const mag = eq.properties.mag;
        return (depth < 70 && mag >= 5.0) || eq.properties.tsunami === 1;
      })
      .map(eq => ({
        id: eq.id,
        type: 'earthquake' as const,
        source: 'USGS' as const,
        title: eq.properties.title,
        severity: eq.properties.mag >= 7.0 ? 'Extreme' : eq.properties.mag >= 6.0 ? 'Severe' : 'Moderate',
        description: `Magnitude ${eq.properties.mag.toFixed(1)} earthquake${eq.properties.tsunami ? ' - TSUNAMI POSSIBLE' : ''}`,
        location: eq.properties.place,
        coordinates: {
          lat: eq.geometry.coordinates[1],
          lng: eq.geometry.coordinates[0]
        },
        timestamp: new Date(eq.properties.time).toISOString(),
        url: eq.properties.url,
      }))
      .slice(0, 15); // Limit to 15 most recent

    return earthquakes;
  } catch (error: any) {
    console.error('Error fetching USGS earthquakes:', error.message);
    return [];
  }
};

export const getAllGovernmentAlerts = async (): Promise<{
  alerts: ProcessedAlert[];
  summary: {
    total: number;
    weather: number;
    tsunami: number;
    earthquake: number;
  };
}> => {
  try {
    const [noaaAlerts, usgsEarthquakes] = await Promise.all([
      getNOAAAlerts(),
      getUSGSEarthquakes()
    ]);

    const allAlerts = [...noaaAlerts, ...usgsEarthquakes]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const summary = {
      total: allAlerts.length,
      weather: allAlerts.filter(a => a.type === 'weather').length,
      tsunami: allAlerts.filter(a => a.type === 'tsunami').length,
      earthquake: allAlerts.filter(a => a.type === 'earthquake').length,
    };

    return {
      alerts: allAlerts,
      summary
    };
  } catch (error: any) {
    console.error('Error fetching government alerts:', error.message);
    return {
      alerts: [],
      summary: { total: 0, weather: 0, tsunami: 0, earthquake: 0 }
    };
  }
};
