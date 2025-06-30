import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración segura de TypeScript
  typescript: {
    // No ignorar errores de TypeScript - construir solo con código válido
    ignoreBuildErrors: false,
  },
  
  // Configuraciones de seguridad y optimización
  reactStrictMode: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com https://accounts.google.com;"
          }
        ]
      }
    ]
  },

  // Optimización de imágenes
  images: {
    domains: ['localhost', 'example.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Variables de entorno requeridas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
