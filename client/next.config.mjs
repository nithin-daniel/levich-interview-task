/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: {
    ignoreDuringBuilds: true, // Add this if you have ESLint issues
  },
  // Remove experimental serverActions config - not needed
};

export default nextConfig;