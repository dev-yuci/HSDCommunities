import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn-images-1.medium.com', 'randomuser.me'],
  },
  // fs ve path modüllerini istemci tarafından hariç tut
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // client-side'da çalıştığında Node.js modüllerini boş objelerle değiştir
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
