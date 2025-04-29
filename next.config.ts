import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar errores de TypeScript durante la construcción
  typescript: {
    // Esta opción permite que la construcción sea exitosa incluso cuando hay errores de tipo
    ignoreBuildErrors: true,
  },
  
  // Otras configuraciones que puedas necesitar
  reactStrictMode: true,
  

};

export default nextConfig;
