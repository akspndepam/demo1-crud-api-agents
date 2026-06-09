import { Request, Response, NextFunction } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ApiResponse } from '../types';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export const generateToken = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error(`Invalid token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  const requestId = req.requestId;

  if (!token) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'MISSING_TOKEN',
        message: 'Authorization token is required. Please include a valid JWT token in the Authorization header.',
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(401).json(response);
    return;
  }

  try {
    const decoded = verifyToken(token);
    // Extend Express Request with user data using declaration merging
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error(`[${requestId}] Token verification failed:`, error);
    const response: ApiResponse<null> = {
      success: false,
      error: {
        errorCode: 'INVALID_TOKEN',
        message: error instanceof Error ? error.message : 'Invalid or expired token',
      },
      timestamp: new Date().toISOString(),
      requestId,
    };
    res.status(401).json(response);
  }
};

export const authorizeRole = (allowedRoles: ('admin' | 'user')[]): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as JwtPayload | undefined;
    const requestId = req.requestId;

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'UNAUTHORIZED',
          message: 'User information not found',
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(403).json(response);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      console.warn(`[${requestId}] User ${user.userId} attempted to access resource with insufficient permissions`);
      const response: ApiResponse<null> = {
        success: false,
        error: {
          errorCode: 'FORBIDDEN',
          message: `This operation requires one of these roles: ${allowedRoles.join(', ')}`,
        },
        timestamp: new Date().toISOString(),
        requestId,
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

// Extend Express Request interface with user data
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
