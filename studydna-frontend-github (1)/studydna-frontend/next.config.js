/** @type {import('next').NextConfig} */
const nextConfig = {
  // Point API calls at the backend — override with NEXT_PUBLIC_API_URL env var
  // in Vercel project settings once the backend is deployed.
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
};

module.exports = nextConfig;
