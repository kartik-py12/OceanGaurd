import { Request, Response } from 'express';
import socialMediaService from '../services/socialMediaService';

export const getSocialMediaAnalytics = async (req: Request, res: Response) => {
    try {
        // Get hazardsOnly parameter from query string (defaults to false)
        const hazardsOnly = req.query.hazardsOnly === 'true';
        
        const analytics = await socialMediaService.getSocialMediaAnalytics(hazardsOnly);
        res.json(analytics);
    } catch (error) {
        console.error('Error fetching social media analytics:', error);
        res.status(500).json({ 
            error: 'Failed to fetch social media analytics',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
