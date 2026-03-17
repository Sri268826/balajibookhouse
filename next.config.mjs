/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // bundles only what's needed — smaller Docker image
};

export default nextConfig;
