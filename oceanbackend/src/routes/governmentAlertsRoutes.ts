import { Router } from 'express';
import { getGovernmentAlerts, getWeatherAtLocation, getForecastAtLocation } from '../controllers/governmentAlertsController';

const router = Router();

router.get('/alerts', getGovernmentAlerts);

router.get('/weather', getWeatherAtLocation);

router.get('/forecast', getForecastAtLocation);

export default router;
