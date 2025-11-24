import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cấu hình để phục vụ file video và media
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  
  // Cấu hình webpack để xử lý file video
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
        },
      },
    });
    return config;
  },
  
  // Cấu hình để fix white screen issues
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
  },
  
  // Cấu hình để fix hydration issues
  reactStrictMode: false,
};

export default nextConfig;
