/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['http://192.168.1.2:3000', 'http://localhost:3000'],

  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
   rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
};

module.exports = nextConfig;
