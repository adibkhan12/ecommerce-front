/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "adib-next-ecommerce.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
