import { Router, Request, Response, NextFunction } from 'express';
import { signup, login } from '../controllers/authController';
import { body, validationResult } from 'express-validator';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

router.post('/signup', signup);

router.post('/login', login);

export default router;
