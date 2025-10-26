/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  compiler: {
    styledComponents: true,
  },
  eslint: {
    // Avoid CI build failures due to ESLint serialization issues
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "adib-next-ecommerce.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "adib-next-ecommerce.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
