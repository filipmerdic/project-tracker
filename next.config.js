/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/project-tracker' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/project-tracker/' : '',
  images: {
    unoptimized: true,
  },
  // This is important for GitHub Pages
  trailingSlash: true,
  // Disable server-side features
  reactStrictMode: true,
};

module.exports = nextConfig; 