/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer }) => {
    // Ignore warnings for platform-specific packages
    config.ignoreWarnings = [
      // Next.js SWC packages
      { module: /node_modules\/@next\/swc-.*/ },
      // Netlify esbuild packages
      { module: /node_modules\/@netlify\/esbuild-.*/ },
      // Parcel watcher packages
      { module: /node_modules\/@parcel\/watcher-.*/ },
      // FSEvents (macOS-specific)
      { module: /node_modules\/fsevents/ },
      // Ignore punycode deprecation warning
      { message: /\[DEP0040\]/ },
    ];

    // Handle punycode module
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        punycode: 'punycode/',
      };
    }

    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // Enable source maps in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    return config;
  },
};

export default nextConfig;
