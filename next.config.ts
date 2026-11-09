import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luvwkuccmwidgcpfklop.supabase.co",
      },
    ],
  },
};

export default nextConfig;
