import { Request, Response } from 'express';
import { searchService } from '../services/search.service';
import { sendSuccessResponse, sendValidationError, sendErrorResponse } from '../utils/responseHandler';

export const searchController = {
  async searchByTitle(req: Request, res: Response) {
    try {
      const { title } = req.query;
      
      if (!title || typeof title !== 'string') {
        return sendValidationError(res, 'Title parameter is required');
      }

      const results = await searchService.searchVendorsByTitle(title);
      
      return sendSuccessResponse(
        res,
        { vendors: results, total: results.length },
        `Found ${results.length} vendor(s) matching "${title}"`
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        'Failed to search vendors',
        500,
        error
      );
    }
  }
};