import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://${process.env.BACKEND_UR || 'backend'}:${process.env.BACKEND_PORT || '3000'}/:path*`,
      },
    ]
  },
};

export default nextConfig;
