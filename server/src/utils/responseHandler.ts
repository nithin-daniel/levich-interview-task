import { Response } from 'express';
import { logger } from './logger';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
  timestamp: string;
}

// Success response handler
export function sendSuccessResponse<T>(
  res: Response, 
  data?: T, 
  message?: string, 
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  logger.info(`Success Response [${statusCode}]: ${message || 'Success'}`, {
    statusCode,
    data: typeof data === 'object' ? JSON.stringify(data) : data
  });

  res.status(statusCode).json(response);
}

// Error response handler
export function sendErrorResponse(
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any
): void {
  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp: new Date().toISOString()
  };

  logger.error(`Error Response [${statusCode}]: ${message}`, {
    statusCode,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error
  });

  res.status(statusCode).json(response);
}

// Validation error response
export function sendValidationError(
  res: Response,
  message: string,
  errors?: any
): void {
  const response: ApiResponse = {
    success: false,
    message,
    error: errors,
    timestamp: new Date().toISOString()
  };

  logger.warn(`Validation Error: ${message}`, { errors });

  res.status(400).json(response);
}

// Authentication error response
export function sendAuthError(
  res: Response,
  message: string = 'Authentication failed'
): void {
  const response: ApiResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  logger.warn(`Auth Error: ${message}`);

  res.status(401).json(response);
}