import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { signupSchema, loginSchema } from "../validators/auth";
import { validate } from "../middleware/validate";

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

export const signup = [
  validate(signupSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists with this email' });
        return;
      }

      const user: any = await User.create({ name, email, password });
      console.log(user);
      const token = generateToken(user._id.toString());

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error creating user' });
    }
  },
];

export const login = [
  validate(loginSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user: any = await User.findOne({ email }).select('+password +role');
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ message: 'Account is suspended' });
        return;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const token = generateToken(user._id.toString());

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error during login' });
    }
  },
];
