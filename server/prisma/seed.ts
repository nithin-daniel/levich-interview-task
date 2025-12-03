import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo users
  const demoUsers = [
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 12),
    },
    {
      email: 'user@example.com', 
      password: await bcrypt.hash('user123', 12),
    },
    {
      email: 'demo@levich.com',
      password: await bcrypt.hash('demo123', 12),
    },
  ];

  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.email}`);
  }

  // Create demo vendors
  const demoVendors = [
    {
      name: 'TechCorp Solutions',
      domain: 'techcorp.com',
      logo: 'https://via.placeholder.com/100x100?text=TC',
      logoColor: '#3B82F6',
      rating: 85,
      trend: 5,
      trendUp: true,
      status: 'Active',
      categories: ['Software Development', 'Cloud Services'],
      extraCategories: 2,
      monitored: true,
    },
    {
      name: 'DataFlow Inc',
      domain: 'dataflow.io',
      logo: 'https://via.placeholder.com/100x100?text=DF',
      logoColor: '#10B981',
      rating: 92,
      trend: 12,
      trendUp: true,
      status: 'Active',
      categories: ['Data Analytics', 'Machine Learning'],
      extraCategories: 1,
      monitored: true,
    },
    {
      name: 'SecureBase',
      domain: 'securebase.net',
      logo: 'https://via.placeholder.com/100x100?text=SB',
      logoColor: '#EF4444',
      rating: 78,
      trend: -3,
      trendUp: false,
      status: 'Active',
      categories: ['Cybersecurity', 'Infrastructure'],
      extraCategories: 0,
      monitored: false,
    },
    {
      name: 'CloudVault',
      domain: 'cloudvault.com',
      logo: 'https://via.placeholder.com/100x100?text=CV',
      logoColor: '#8B5CF6',
      rating: 88,
      trend: 8,
      trendUp: true,
      status: 'Active',
      categories: ['Cloud Storage', 'Backup Solutions'],
      extraCategories: 1,
      monitored: true,
    },
    {
      name: 'DevOps Pro',
      domain: 'devopspro.dev',
      logo: 'https://via.placeholder.com/100x100?text=DP',
      logoColor: '#F59E0B',
      rating: 90,
      trend: 15,
      trendUp: true,
      status: 'Active',
      categories: ['DevOps', 'CI/CD', 'Automation'],
      extraCategories: 3,
      monitored: true,
    },
  ];

  for (const vendorData of demoVendors) {
    const vendor = await prisma.vendor.upsert({
      where: { domain: vendorData.domain },
      update: {},
      create: vendorData,
    });
    console.log(`✅ Created vendor: ${vendor.name}`);
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });