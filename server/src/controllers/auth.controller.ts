import { Request, Response } from 'express';
import { registerUser, loginUser, RegisterData, LoginData } from '../services/auth.service';

// Function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to send success response
function sendSuccess(res: Response, data: any, message?: string, statusCode: number = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

// Function to send error response
function sendError(res: Response, message: string, statusCode: number = 500) {
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
}

// Register new user
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as RegisterData;

    // Validate required fields
    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      sendError(res, 'Invalid email format', 400);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      sendError(res, 'Password must be at least 6 characters long', 400);
      return;
    }

    const result = await registerUser({ email, password });

    sendSuccess(res, result, 'User registered successfully', 201);
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error && error.message === 'User with this email already exists') {
      sendError(res, error.message, 409);
    } else {
      sendError(res, 'Internal server error during registration', 500);
    }
  }
}

// Login user
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginData;

    // Validate required fields
    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    const result = await loginUser({ email, password });

    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error && error.message === 'Invalid email or password') {
      sendError(res, error.message, 401);
    } else {
      sendError(res, 'Internal server error during login', 500);
    }
  }
}

// Get current user profile
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    // User info is attached by the auth middleware
    const user = (req as any).user;

    sendSuccess(res, { user }, 'User profile retrieved successfully');
  } catch (error) {
    console.error('Get user profile error:', error);
    sendError(res, 'Internal server error', 500);
  }
}