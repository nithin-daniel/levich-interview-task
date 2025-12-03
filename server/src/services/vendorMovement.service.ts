export interface Vendor {
  id: number;
  name: string;
  domain: string;
  logo: string;
  logoColor: string;
  rating: number;
  trend: number;
  trendUp: boolean;
  lastAssessed: string;
  status: 'Active' | 'Inactive';
  categories: string[];
  extraCategories: number;
  monitored: boolean;
}

export class VendorService {
  // Mock data for now - replace with database operations
  private vendors: Vendor[] = [
    {
      id: 1,
      name: "Ephemeral",
      domain: "ephemeral.io",
      logo: "E",
      logoColor: "from-pink-400 to-pink-600",
      rating: 60,
      trend: 5,
      trendUp: true,
      lastAssessed: "22 Jan 2025",
      status: "Active",
      categories: ["Customer data", "Admin"],
      extraCategories: 4,
      monitored: true,
    },
    {
      id: 2,
      name: "Stack3d Lab",
      domain: "stack3dlab.com",
      logo: "S",
      logoColor: "from-emerald-400 to-emerald-600",
      rating: 72,
      trend: 4,
      trendUp: false,
      lastAssessed: "20 Jan 2025",
      status: "Active",
      categories: ["Business data", "Admin"],
      extraCategories: 4,
      monitored: true,
    },
  ];

  async getAllVendors(): Promise<Vendor[]> {
    return this.vendors;
  }

  async getVendorById(id: number): Promise<Vendor | undefined> {
    return this.vendors.find(vendor => vendor.id === id);
  }

  async createVendor(vendorData: Omit<Vendor, 'id'>): Promise<Vendor> {
    const newId = Math.max(...this.vendors.map(v => v.id)) + 1;
    const newVendor: Vendor = {
      ...vendorData,
      id: newId,
      logo: vendorData.name.charAt(0).toUpperCase(),
      logoColor: 'from-blue-400 to-blue-600',
      trend: 0,
      trendUp: true,
      lastAssessed: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      extraCategories: Math.max(0, vendorData.categories.length - 2)
    };
    
    this.vendors.push(newVendor);
    return newVendor;
  }

  async updateVendor(id: number, vendorData: Partial<Vendor>): Promise<Vendor> {
    const vendorIndex = this.vendors.findIndex(vendor => vendor.id === id);
    if (vendorIndex === -1) {
      throw new Error('Vendor not found');
    }
    
    this.vendors[vendorIndex] = { ...this.vendors[vendorIndex], ...vendorData };
    return this.vendors[vendorIndex];
  }

  async deleteVendor(id: number): Promise<void> {
    const vendorIndex = this.vendors.findIndex(vendor => vendor.id === id);
    if (vendorIndex === -1) {
      throw new Error('Vendor not found');
    }
    
    this.vendors.splice(vendorIndex, 1);
  }
}