import express from 'express';
import { getSocialMediaAnalytics } from '../controllers/socialMediaController';

const router = express.Router();

router.get('/analytics', getSocialMediaAnalytics);

export default router;
