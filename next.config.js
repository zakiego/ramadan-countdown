/** @type {import('next').NextConfig} */
const nextConfig = {
  // outputFileTracingIncludes removed - using static imports for Cloudflare Workers compatibility
  output: "standalone",
};

export default nextConfig;
