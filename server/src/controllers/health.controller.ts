import { Request, Response } from 'express';

// Helper functions for response formatting
const sendSuccess = (res: Response, data: any, message?: string, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const getHealth = (req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  sendSuccess(res, healthData, 'Server is healthy');
};

export const getStatus = (req: Request, res: Response) => {
  const statusData = {
    message: 'Levich Interview Task API Server',
    status: 'running',
    version: '1.0.0'
  };

  sendSuccess(res, statusData, 'Server is running');
};