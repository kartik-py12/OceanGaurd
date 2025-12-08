import { Request, Response } from 'express';
import { getAllGovernmentAlerts } from '../services/governmentAlertsService';
import { getOceanWeather, getMarineForecast, getWindDirection, getSeaConditions } from '../services/oceanWeatherService';

export const getGovernmentAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await getAllGovernmentAlerts();
    
    res.status(200).json({
      message: 'Government alerts retrieved successfully',
      data: result.alerts,
      summary: result.summary,
      lastUpdated: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in getGovernmentAlerts:', error);
    res.status(500).json({ 
      message: 'Error fetching government alerts',
      error: error.message 
    });
  }
};

export const getWeatherAtLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ message: 'Invalid coordinates' });
      return;
    }

    const weather = await getOceanWeather(latitude, longitude);

    if (!weather) {
      res.status(500).json({ message: 'Unable to fetch weather data' });
      return;
    }

    const seaConditions = getSeaConditions(weather.wind.speed);
    const windDirection = getWindDirection(weather.wind.direction);

    res.status(200).json({
      message: 'Ocean weather retrieved successfully',
      data: {
        ...weather,
        wind: {
          ...weather.wind,
          compassDirection: windDirection
        },
        seaConditions
      }
    });
  } catch (error: any) {
    console.error('Error in getWeatherAtLocation:', error);
    res.status(500).json({ 
      message: 'Error fetching ocean weather',
      error: error.message 
    });
  }
};

export const getForecastAtLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ message: 'Invalid coordinates' });
      return;
    }

    const forecast = await getMarineForecast(latitude, longitude);

    if (!forecast) {
      res.status(500).json({ message: 'Unable to fetch forecast data' });
      return;
    }

    res.status(200).json({
      message: 'Marine forecast retrieved successfully',
      data: forecast
    });
  } catch (error: any) {
    console.error('Error in getForecastAtLocation:', error);
    res.status(500).json({ 
      message: 'Error fetching marine forecast',
      error: error.message 
    });
  }
};
