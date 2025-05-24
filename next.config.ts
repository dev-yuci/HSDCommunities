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
  // E-posta gönderimi için sunucu tarafı yapılandırma
  serverRuntimeConfig: {
    // Sadece sunucu tarafında kullanılacak değişkenler
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
      from: process.env.SMTP_FROM || '"HSD Communities" <no-reply@hsdcommunities.com>',
    }
  },
  // Hem sunucu hem istemci tarafında kullanılacak değişkenler
  publicRuntimeConfig: {
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};

export default nextConfig;
