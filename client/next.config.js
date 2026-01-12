/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove rewrites - API calls should go directly to the backend URL
  // The NEXT_PUBLIC_API_URL env var is used in the API client
}

module.exports = nextConfig