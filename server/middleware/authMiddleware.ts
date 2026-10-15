import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/auth';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Beginner-Friendly Authentication Middleware
 * 
 * How this works:
 * 1. Checks if the incoming request has an 'Authorization' header.
 * 2. Extracts the token from format: "Bearer <token>".
 * 3. Verifies the token signature using the configured JWT_SECRET.
 * 4. Decodes user information (id, email, name) and attaches it to req.user.
 * 5. Calls next() to let the request proceed to the route controller.
 */
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication token missing.',
    });
    return;
  }

  try {
    const secret = getJwtSecret();
    if (!secret) {
      res.status(503).json({
        success: false,
        message: 'Authentication is not configured. Please contact the service administrator.',
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      email: string;
      name: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};
