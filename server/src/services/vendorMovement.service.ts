import { PrismaClient, Vendor as PrismaVendor } from '@prisma/client';

export interface CreateVendorData {
  name: string;
  domain: string;
  logo?: string;
  logoColor?: string;
  rating: number;
  trend?: number;
  trendUp?: boolean;
  status?: string;
  categories: string[];
  extraCategories?: number;
  monitored?: boolean;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {}

export interface VendorFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  monitored?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedVendors {
  data: PrismaVendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Create a shared Prisma instance
const prisma = new PrismaClient();

// Utility function for random logo color
const generateRandomLogoColor = (): string => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-emerald-400 to-emerald-600'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getAllVendors = async (filters: VendorFilters = {}): Promise<PaginatedVendors> => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    monitored,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters;

  const skip = (page - 1) * limit;
  
  // Build where clause
  const where: any = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { domain: { contains: search, mode: 'insensitive' } },
      { categories: { hasSome: [search] } }
    ];
  }
  
  if (status) {
    where.status = status;
  }
  
  if (monitored !== undefined) {
    where.monitored = monitored;
  }

  // Get total count
  const total = await prisma.vendor.count({ where });
  
  // Get vendors with pagination
  const vendors = await prisma.vendor.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    }
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: vendors,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

export const getVendorById = async (id: number): Promise<PrismaVendor | null> => {
  return prisma.vendor.findUnique({
    where: { id }
  });
};

export const createVendor = async (vendorData: CreateVendorData): Promise<PrismaVendor> => {
  const data = {
    name: vendorData.name,
    domain: vendorData.domain,
    logo: vendorData.logo || vendorData.name.charAt(0).toUpperCase(),
    logoColor: vendorData.logoColor || generateRandomLogoColor(),
    rating: vendorData.rating,
    trend: vendorData.trend || 0,
    trendUp: vendorData.trendUp !== undefined ? vendorData.trendUp : true,
    status: vendorData.status || 'Active',
    categories: vendorData.categories,
    extraCategories: vendorData.extraCategories || Math.max(0, vendorData.categories.length - 2),
    monitored: vendorData.monitored || false
  };

  return prisma.vendor.create({ data });
};

export const updateVendor = async (id: number, vendorData: UpdateVendorData): Promise<PrismaVendor> => {
  const updateData: any = { ...vendorData };
  
  // Update extraCategories if categories are provided
  if (vendorData.categories) {
    updateData.extraCategories = Math.max(0, vendorData.categories.length - 2);
  }

  return prisma.vendor.update({
    where: { id },
    data: updateData
  });
};

export const deleteVendor = async (id: number): Promise<void> => {
  await prisma.vendor.delete({
    where: { id }
  });
};

export const toggleMonitoring = async (id: number): Promise<PrismaVendor> => {
  const vendor = await getVendorById(id);
  if (!vendor) {
    throw new Error('Vendor not found');
  }

  return prisma.vendor.update({
    where: { id },
    data: {
      monitored: !vendor.monitored
    }
  });
};

export const disconnectPrisma = async (): Promise<void> => {
  await prisma.$disconnect();
};