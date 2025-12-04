import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchService = {
  async searchVendorsByTitle(title: string) {
    try {
      const vendors = await prisma.vendor.findMany({
        where: {
          name: {
            contains: title,
            mode: 'insensitive'
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return vendors;
    } catch (error) {
      console.error('Error searching vendors:', error);
      throw new Error('Failed to search vendors');
    }
  }
};