import { Request, Response } from 'express';

export class BaseController {
  protected sendSuccess(res: Response, data: any, message?: string, statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  protected sendError(res: Response, message: string, statusCode: number = 500, error?: any) {
    res.status(statusCode).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
      timestamp: new Date().toISOString()
    });
  }
}