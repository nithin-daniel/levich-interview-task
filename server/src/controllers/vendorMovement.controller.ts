import { Request, Response } from 'express';
import * as vendorService from '../services/vendorMovement.service';
import { VendorFilters } from '../services/vendorMovement.service';

// Helper functions for response formatting
const sendSuccess = (res: Response, data: any, message?: string, statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res: Response, message: string, statusCode: number = 500, error?: any) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
    timestamp: new Date().toISOString()
  });
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const filters: VendorFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      status: req.query.status as string,
      monitored: req.query.monitored ? req.query.monitored === 'true' : undefined,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc'
    };
    
    const result = await vendorService.getAllVendors(filters);
    sendSuccess(res, result, 'Vendors retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve vendors', 500, error);
  }
};

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await vendorService.createVendor(req.body);
    sendSuccess(res, vendor, 'Vendor created successfully', 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return sendError(res, 'Domain already exists', 409, error);
    }
    sendError(res, 'Failed to create vendor', 500, error);
  }
};

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = parseInt(id);
    
    if (isNaN(vendorId)) {
      return sendError(res, 'Invalid vendor ID', 400);
    }
    
    const vendor = await vendorService.getVendorById(vendorId);
    
    if (!vendor) {
      return sendError(res, 'Vendor not found', 404);
    }
    
    sendSuccess(res, vendor, 'Vendor retrieved successfully');
  } catch (error) {
    sendError(res, 'Failed to retrieve vendor', 500, error);
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = parseInt(id);
    
    if (isNaN(vendorId)) {
      return sendError(res, 'Invalid vendor ID', 400);
    }
    
    const vendor = await vendorService.updateVendor(vendorId, req.body);
    sendSuccess(res, vendor, 'Vendor updated successfully');
  } catch (error: any) {
    if (error.code === 'P2025') {
      return sendError(res, 'Vendor not found', 404);
    }
    if (error.code === 'P2002') {
      return sendError(res, 'Domain already exists', 409, error);
    }
    sendError(res, 'Failed to update vendor', 500, error);
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = parseInt(id);
    
    if (isNaN(vendorId)) {
      return sendError(res, 'Invalid vendor ID', 400);
    }
    
    await vendorService.deleteVendor(vendorId);
    sendSuccess(res, null, 'Vendor deleted successfully');
  } catch (error: any) {
    if (error.code === 'P2025') {
      return sendError(res, 'Vendor not found', 404);
    }
    sendError(res, 'Failed to delete vendor', 500, error);
  }
};

export const toggleMonitoring = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vendorId = parseInt(id);
    
    if (isNaN(vendorId)) {
      return sendError(res, 'Invalid vendor ID', 400);
    }
    
    const vendor = await vendorService.toggleMonitoring(vendorId);
    sendSuccess(res, vendor, 'Vendor monitoring toggled successfully');
  } catch (error: any) {
    if (error.code === 'P2025') {
      return sendError(res, 'Vendor not found', 404);
    }
    sendError(res, 'Failed to toggle vendor monitoring', 500, error);
  }
};