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
    defaultLocale: 'en',
    localeDetection: false
  },
  exportPathMap: function () {
    return {
      '/en': { page: '/[lang]' },
      '/en/blog/nextjs': { page: '/[lang]/blog/[path]/' },
      '/en/projects/nextjs': { page: '/[lang]/projects/[path]/' },
    }
  },
}

module.exports = nextConfig
