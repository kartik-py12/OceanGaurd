import { Router, Request, Response, NextFunction } from 'express';
import {
  createHazardReport,
  getHazardReports,
  getHazardReportById,
  updateHazardReport,
  deleteHazardReport,
} from '../controllers/hazardController';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { upload } from '../middleware/upload';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

router.get('/', getHazardReports);
router.get('/:id', getHazardReportById);

router.use(authenticate);

router.post(
  '/',
  upload.single('image'), 
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  },
  [
    body('type').isIn(['Oil Spill', 'Debris', 'Pollution', 'Other']).withMessage('Invalid hazard type'),
    body('location').optional().custom((value, { req }) => {
      const locationValue = value || req.body.location;
      if (!locationValue) {
        return true; 
      }
      if (typeof locationValue === 'string') {
        try {
          const parsed = JSON.parse(locationValue);
          if (typeof parsed.lat !== 'number' || typeof parsed.lng !== 'number') {
            throw new Error('Invalid location format');
          }
          if (parsed.lat < -90 || parsed.lat > 90 || parsed.lng < -180 || parsed.lng > 180) {
            throw new Error('Invalid location coordinates');
          }
        } catch (e: any) {
          return true;
        }
      } else if (locationValue && (typeof locationValue.lat !== 'number' || typeof locationValue.lng !== 'number')) {
        return true;
      }
      return true;
    }),
    body('severity').custom((value) => {
      const severity = typeof value === 'string' ? parseInt(value) : value;
      if (isNaN(severity) || severity < 1 || severity > 10) {
        throw new Error('Severity must be between 1 and 10');
      }
      return true;
    }),
    validate,
  ],
  createHazardReport
);

router.put('/:id', updateHazardReport);
router.delete('/:id', deleteHazardReport);

export default router;

