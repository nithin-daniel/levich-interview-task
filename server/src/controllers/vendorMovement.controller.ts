import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { VendorService } from '../services/vendorMovement.service';

export class VendorController extends BaseController {
  private vendorService: VendorService;

  constructor() {
    super();
    this.vendorService = new VendorService();
  }

  public getAllVendors = async (req: Request, res: Response) => {
    try {
      const vendors = await this.vendorService.getAllVendors();
      this.sendSuccess(res, vendors, 'Vendors retrieved successfully');
    } catch (error) {
      this.sendError(res, 'Failed to retrieve vendors', 500, error);
    }
  };

  public createVendor = async (req: Request, res: Response) => {
    try {
      const vendor = await this.vendorService.createVendor(req.body);
      this.sendSuccess(res, vendor, 'Vendor created successfully', 201);
    } catch (error) {
      this.sendError(res, 'Failed to create vendor', 500, error);
    }
  };

  public getVendorById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vendor = await this.vendorService.getVendorById(parseInt(id));
      
      if (!vendor) {
        return this.sendError(res, 'Vendor not found', 404);
      }
      
      this.sendSuccess(res, vendor, 'Vendor retrieved successfully');
    } catch (error) {
      this.sendError(res, 'Failed to retrieve vendor', 500, error);
    }
  };

  public updateVendor = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vendor = await this.vendorService.updateVendor(parseInt(id), req.body);
      this.sendSuccess(res, vendor, 'Vendor updated successfully');
    } catch (error) {
      this.sendError(res, 'Failed to update vendor', 500, error);
    }
  };

  public deleteVendor = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.vendorService.deleteVendor(parseInt(id));
      this.sendSuccess(res, null, 'Vendor deleted successfully');
    } catch (error) {
      this.sendError(res, 'Failed to delete vendor', 500, error);
    }
  };
}