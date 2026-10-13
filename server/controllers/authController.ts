import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { getIsDbConnected } from '../config/db';
import { memoryStore } from '../data/store';
import { AuthRequest } from '../middleware/authMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'fixnear_jwt_super_secret_key_2026';

/**
 * Generate a JWT token for a user
 */
const generateToken = (id: string, email: string, name: string): string => {
  return jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, city } = req.body;

    // 1. Basic validation
    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Please provide your full name.' });
      return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (!password || password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Check if email already exists
    if (getIsDbConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
        return;
      }

      // 3. Hash password using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Save user to MongoDB
      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        city: city?.trim() || 'Metro Area',
        createdAt: new Date(),
      });

      const token = generateToken(newUser._id.toString(), newUser.email, newUser.name);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          city: newUser.city,
          createdAt: newUser.createdAt,
        },
      });
    } else {
      // In-Memory Fallback
      const existingInMemory = memoryStore.users.find((u) => u.email === cleanEmail);
      if (existingInMemory) {
        res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUserId = 'usr_' + Date.now();
      const newUser = {
        _id: newUserId,
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        city: city?.trim() || 'Metro Area',
        createdAt: new Date(),
      };

      memoryStore.users.push(newUser);

      // Add a welcome notification
      memoryStore.notifications.unshift({
        _id: 'notif_' + Date.now(),
        userId: newUserId,
        message: `Welcome to FixNear, ${newUser.name}! Your civic reporting account is active.`,
        type: 'SYSTEM',
        read: false,
        createdAt: new Date(),
      });

      const token = generateToken(newUser._id, newUser.email, newUser.name);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          city: newUser.city,
          createdAt: newUser.createdAt,
        },
      });
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during signup. Please try again.',
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (getIsDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const token = generateToken(user._id.toString(), user.email, user.name);

      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          city: user.city,
          createdAt: user.createdAt,
        },
      });
    } else {
      // In-Memory Fallback
      const user = memoryStore.users.find((u) => u.email === cleanEmail);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const token = generateToken(user._id, user.email, user.name);

      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          city: user.city,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by JWT)
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (getIsDbConnected()) {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          city: user.city,
          createdAt: user.createdAt,
        },
      });
    } else {
      const user = memoryStore.users.find((u) => u._id === userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          city: user.city,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error: any) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
};
