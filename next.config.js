/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // IMPORTANTE: Se o nome do seu repositório no GitHub for diferente de "Air", altere aqui.
  basePath: '/Air',
  assetPrefix: '/Air/',
}

module.exports = nextConfig