import { z } from 'zod';

// Schema de validación para variables de entorno del cliente
const clientConfigSchema = z.object({
  backendUrl: z.string().url('Invalid backend URL'),
  cognitoClientId: z.string().min(1, 'Cognito Client ID is required'),
  googleClientId: z.string().optional(),
});

// Schema de validación para variables de entorno del servidor
const serverConfigSchema = z.object({
  awsRegion: z.string().min(1, 'AWS Region is required'),
  awsAccessKeyId: z.string().min(1, 'AWS Access Key ID is required'),
  awsSecretAccessKey: z.string().min(1, 'AWS Secret Access Key is required'),
  cognitoUserPoolId: z.string().min(1, 'Cognito User Pool ID is required'),
  cognitoClientSecret: z.string().optional(),
  googleClientSecret: z.string().optional(),
  nextAuthSecret: z.string().min(1, 'NextAuth Secret is required'),
});

// Configuración del cliente (disponible en el browser)
function getClientConfig() {
  const config = {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api',
    cognitoClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  };

  try {
    return clientConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Client configuration validation failed:', error.errors);
      throw new Error(`Invalid client configuration: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Configuración del servidor (solo disponible en el servidor)
function getServerConfig() {
  if (typeof window !== 'undefined') {
    throw new Error('Server configuration should not be accessed on the client side');
  }

  const config = {
    awsRegion: process.env.AWS_REGION || '',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || '',
    cognitoClientSecret: process.env.COGNITO_CLIENT_SECRET,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
  };

  try {
    return serverConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Server configuration validation failed:', error.errors);
      throw new Error(`Invalid server configuration: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Exportar configuraciones
export const clientConfig = getClientConfig();
export const getServerConfigSafe = () => getServerConfig();

// Función de utilidad para verificar si estamos en el servidor
export const isServer = typeof window === 'undefined';