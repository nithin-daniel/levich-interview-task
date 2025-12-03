import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  RegisterData,
  LoginData,
} from "../services/auth.service";
import {
  sendSuccessResponse,
  sendErrorResponse,
  sendValidationError,
} from "../utils/responseHandler";
import { logger } from "../utils/logger";
import {
  isValidEmail,
  isValidPassword,
  validateRequiredFields,
  sanitizeEmail,
  createTimer
} from "../utils/validation";

// Register new user
export async function register(req: Request, res: Response): Promise<void> {
  const timer = createTimer();
  logger.info("User registration attempt started", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    const { email, password } = req.body as RegisterData;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['email', 'password']);
    if (!validation.isValid) {
      logger.warn("Registration failed: Missing required fields", {
        missingFields: validation.missingFields,
      });
      sendValidationError(res, `Missing required fields: ${validation.missingFields.join(', ')}`);
      return;
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      logger.warn("Registration failed: Invalid email format", { email: sanitizedEmail });
      sendValidationError(res, "Invalid email format");
      return;
    }

    // Validate password length
    if (!isValidPassword(password)) {
      logger.warn("Registration failed: Password too short", {
        passwordLength: password.length,
      });
      sendValidationError(res, "Password must be at least 6 characters long");
      return;
    }

    const result = await registerUser({ email: sanitizedEmail, password });

    logger.info("User registration successful", {
      userId: result.user.id,
      email: result.user.email,
      duration: timer.getElapsedFormatted(),
    });

    sendSuccessResponse(res, result, "User registered successfully", 201);
  } catch (error) {
    logger.error("Registration error occurred", {
      error: error instanceof Error ? error.message : error,
      duration: timer.getElapsedFormatted(),
    });

    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      sendErrorResponse(res, error.message, 409);
    } else {
      sendErrorResponse(
        res,
        "Internal server error during registration",
        500,
        error
      );
    }
  }
}

// Login user
export async function login(req: Request, res: Response): Promise<void> {
  const timer = createTimer();
  logger.info("User login attempt started", {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  try {
    const { email, password } = req.body as LoginData;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['email', 'password']);
    if (!validation.isValid) {
      logger.warn("Login failed: Missing required fields", {
        missingFields: validation.missingFields,
      });
      sendValidationError(res, `Missing required fields: ${validation.missingFields.join(', ')}`);
      return;
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    const result = await loginUser({ email: sanitizedEmail, password });

    logger.info("User login successful", {
      userId: result.user.id,
      email: result.user.email,
      duration: timer.getElapsedFormatted(),
    });

    sendSuccessResponse(res, result, "Login successful");
  } catch (error) {
    logger.warn("Login failed", {
      email: req.body.email,
      error: error instanceof Error ? error.message : error,
      duration: timer.getElapsedFormatted(),
    });

    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      sendErrorResponse(res, error.message, 401);
    } else {
      sendErrorResponse(res, "Internal server error during login", 500, error);
    }
  }
}

// Get current user profile
export async function getCurrentUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // User info is attached by the auth middleware
    const user = (req as any).user;

    logger.info("User profile retrieved", { userId: user?.id });

    sendSuccessResponse(res, { user }, "User profile retrieved successfully");
  } catch (error) {
    logger.error("Error retrieving user profile", { error });
    sendErrorResponse(res, "Internal server error", 500, error);
  }
}
