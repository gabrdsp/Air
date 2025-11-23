/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';

const basePath = isProd && isGhPages ? '/Air' : '';
const assetPrefix = isProd && isGhPages ? '/Air/' : '';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
