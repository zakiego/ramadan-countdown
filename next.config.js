/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/": ["./public/content/**/*"],
      "/api/*": ["./public/content/**/*"],
    },
  },
};

export default nextConfig;
