/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { serverActions: { allowedOrigins: ["*"] } },
};

export default nextConfig;
