/** @type {import('next').NextConfig} */

const nextConfig = {
  // Always use export for GitHub Pages
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/project-tracker' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/project-tracker/' : '',
  images: {
    unoptimized: true,
  },
  // This is important for GitHub Pages
  trailingSlash: true,
  // Disable server-side features
  reactStrictMode: true,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable unnecessary features for static export
  experimental: {
    // Disable features that require server components
    serverActions: false,
  },
};

module.exports = nextConfig; 