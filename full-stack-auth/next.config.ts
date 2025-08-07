import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Node.js modules for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        'util/types': false,
      };
    }

    // Ensure Scalekit SDK is only used server-side
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push('@scalekit-sdk/node');
    }

    return config;
  },
};

export default nextConfig;
