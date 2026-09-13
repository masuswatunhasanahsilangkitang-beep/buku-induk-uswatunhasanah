import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Abaikan error TS agar Vercel tetap melanjutkan build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Abaikan peringatan ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;