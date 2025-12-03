import { Request, Response } from 'express';
import { BaseController } from './base.controller';

export class HealthController extends BaseController {
  public getHealth = (req: Request, res: Response) => {
    const healthData = {
      status: 'healthy',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };

    this.sendSuccess(res, healthData, 'Server is healthy');
  };

  public getStatus = (req: Request, res: Response) => {
    const statusData = {
      message: 'Levich Interview Task API Server',
      status: 'running',
      version: '1.0.0'
    };

    this.sendSuccess(res, statusData, 'Server is running');
  };
}