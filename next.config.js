/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Remove previous warning suppression attempts
    return config;
  },
};

// Suppress Node.js deprecation warnings
process.removeAllListeners('warning');

module.exports = nextConfig; 