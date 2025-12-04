/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  experimental: {
    runtime: "nodejs",        // force global node runtime
  },

  // stop Next from trying to use Edge automatically
  middleware: false,          

  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
