import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { getJwtSecret } from '../config/auth';
import { getIsDbConnected } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export interface AuthUser {
  _id: string | { toString(): string };
  name: string;
  email: string;
  password: string;
  city: string;
  createdAt: Date;
}

export interface AuthUserRepository {
  findByEmail(email: string): Promise<AuthUser | null>;
  create(user: Omit<AuthUser, '_id'>): Promise<AuthUser>;
  findById(id: string): Promise<AuthUser | null>;
}

interface AuthControllerDependencies {
  users: AuthUserRepository;
  isDatabaseConnected: () => boolean;
  getJwtSecret: () => string | undefined;
}

const mongoUsers: AuthUserRepository = {
  findByEmail: async (email) => User.findOne({ email }),
  create: async (user) => User.create(user),
  findById: async (id) => User.findById(id).select('-password'),
};

const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  error.code === 11000;

const publicUser = (user: AuthUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  city: user.city,
  createdAt: user.createdAt,
});

export const createAuthController = ({
  users,
  isDatabaseConnected,
  getJwtSecret,
}: AuthControllerDependencies) => {
  const getSecret = (res: Response): string | null => {
    const secret = getJwtSecret();
    if (!secret || secret.length < 32) {
      res.status(503).json({
        success: false,
        message: 'Authentication is not configured. Set a JWT_SECRET of at least 32 characters.',
      });
      return null;
    }
    return secret;
  };

  const signup = async (req: Request, res: Response): Promise<void> => {
    const body = req.body ?? {};
    const { name, email, password, city } = body as Record<string, unknown>;

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ success: false, message: 'Please provide your full name.' });
      return;
    }

    if (
      typeof email !== 'string' ||
      email.length > 254 ||
      !/^\S+@\S+\.\S+$/.test(email.trim())
    ) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      res.status(400).json({
        success: false,
        message: 'Password must be between 6 and 128 characters long.',
      });
      return;
    }

    if (city !== undefined && typeof city !== 'string') {
      res.status(400).json({ success: false, message: 'Please provide a valid city or neighborhood.' });
      return;
    }

    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        message: 'Account registration is temporarily unavailable because persistent storage is not connected.',
      });
      return;
    }

    const secret = getSecret(res);
    if (!secret) return;

    const cleanEmail = email.trim().toLowerCase();

    try {
      const existingUser = await users.findByEmail(cleanEmail);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await users.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        city: typeof city === 'string' && city.trim() ? city.trim() : 'Metro Area',
        createdAt: new Date(),
      });

      const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email, name: newUser.name },
        secret,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: publicUser(newUser),
      });
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
        return;
      }

      console.error(
        'Signup failed:',
        error instanceof Error ? error.name : 'UnknownError'
      );
      res.status(500).json({
        success: false,
        message: 'Unable to create your account right now. Please try again.',
      });
    }
  };

  const login = async (req: Request, res: Response): Promise<void> => {
    const body = req.body ?? {};
    const { email, password } = body as Record<string, unknown>;

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        message: 'Sign in is temporarily unavailable because persistent storage is not connected.',
      });
      return;
    }

    const secret = getSecret(res);
    if (!secret) return;

    try {
      const user = await users.findByEmail(email.trim().toLowerCase());
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, name: user.name },
        secret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: publicUser(user),
      });
    } catch (error) {
      console.error(
        'Login failed:',
        error instanceof Error ? error.name : 'UnknownError'
      );
      res.status(500).json({
        success: false,
        message: 'Unable to sign in right now. Please try again.',
      });
    }
  };

  const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (!isDatabaseConnected()) {
      res.status(503).json({
        success: false,
        message: 'Your session cannot be verified because persistent storage is not connected.',
      });
      return;
    }

    try {
      const user = await users.findById(userId);
      if (!user) {
        res.status(401).json({ success: false, message: 'Your session is no longer valid. Please sign in again.' });
        return;
      }

      res.json({ success: true, user: publicUser(user) });
    } catch (error) {
      console.error(
        'Profile lookup failed:',
        error instanceof Error ? error.name : 'UnknownError'
      );
      res.status(500).json({
        success: false,
        message: 'Unable to verify your session right now. Please try again.',
      });
    }
  };

  return { signup, login, getMe };
};

const authController = createAuthController({
  users: mongoUsers,
  isDatabaseConnected: getIsDbConnected,
  getJwtSecret,
});

export const signup = authController.signup;
export const login = authController.login;
export const getMe = authController.getMe;
