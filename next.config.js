/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/server/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://your-backend-url.railway.app/api/:path*'
          : 'http://localhost:5001/api/:path*',
      },
    ]
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig