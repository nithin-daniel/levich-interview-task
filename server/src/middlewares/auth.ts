import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

// Function to send authentication error
function sendAuthError(res: Response, message: string, statusCode: number = 401) {
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
}

// Required authentication middleware
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      sendAuthError(res, 'Access token is missing');
      return;
    }

    // Check if it's Bearer token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      sendAuthError(res, 'Access token is missing');
      return;
    }

    // Verify token and get user
    const user = await verifyToken(token);

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);

    let message = 'Authentication failed';
    if (error instanceof Error) {
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        message = error.message;
      }
    }

    sendAuthError(res, message);
  }
}

// Optional authentication middleware - doesn't fail if no token is provided
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      next();
      return;
    }

    // Verify token and get user
    const user = await verifyToken(token);

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    // For optional auth, we just continue without user
    next();
  }
}