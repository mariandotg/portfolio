/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
    ],
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en'
  },
  output: 'export'
}

module.exports = nextConfig
