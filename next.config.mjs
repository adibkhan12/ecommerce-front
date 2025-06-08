/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    experimental: {
    scrollRestoration: true,
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
