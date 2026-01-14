import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'fe229695-d2a4-4d53-a692-f6443d594f63-00-v6jwnbw8cmb5.picard.replit.dev',
        '*.replit.dev',
        '*.replit.app',
      ],
    },
  },
};

export default nextConfig;
