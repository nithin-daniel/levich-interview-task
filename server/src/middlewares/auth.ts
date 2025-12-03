import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service";
import { sendAuthError } from "../utils/responseHandler";
import { logger } from "../utils/logger";

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

// Required authentication middleware
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const requestId = req.get("X-Request-ID") || "unknown";

    logger.debug("Authentication middleware triggered", {
      path: req.path,
      method: req.method,
      requestId,
      hasAuthHeader: !!authHeader,
    });

    if (!authHeader) {
      logger.warn("Authentication failed: No authorization header", {
        path: req.path,
        requestId,
      });
      sendAuthError(res, "Access token is missing");
      return;
    }

    // Check if it's Bearer token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      logger.warn("Authentication failed: No token in authorization header", {
        path: req.path,
        requestId,
      });
      sendAuthError(res, "Access token is missing");
      return;
    }

    // Verify token and get user
    const user = await verifyToken(token);

    // Attach user to request object
    req.user = user;

    logger.debug("Authentication successful", {
      userId: user.id,
      email: user.email,
      path: req.path,
      requestId,
    });

    next();
  } catch (error) {
    logger.warn("Authentication middleware error", {
      path: req.path,
      error: error instanceof Error ? error.message : error,
    });

    let message = "Authentication failed";
    if (error instanceof Error) {
      if (
        error.message.includes("Invalid") ||
        error.message.includes("expired")
      ) {
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
    const requestId = req.get("X-Request-ID") || "unknown";

    logger.debug("Optional authentication middleware triggered", {
      path: req.path,
      method: req.method,
      requestId,
      hasAuthHeader: !!authHeader,
    });

    if (!authHeader) {
      logger.debug("No authentication header, proceeding without auth", {
        path: req.path,
      });
      next();
      return;
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      logger.debug(
        "No token in authorization header, proceeding without auth",
        { path: req.path }
      );
      next();
      return;
    }

    // Verify token and get user
    const user = await verifyToken(token);

    // Attach user to request object
    req.user = user;

    logger.debug("Optional authentication successful", {
      userId: user.id,
      email: user.email,
      path: req.path,
    });

    next();
  } catch (error) {
    // For optional auth, we just continue without user
    logger.debug("Optional authentication failed, proceeding without auth", {
      path: req.path,
      error: error instanceof Error ? error.message : error,
    });
    next();
  }
}
