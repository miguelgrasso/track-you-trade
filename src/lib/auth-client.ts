// Cliente de autenticación - SIN credenciales AWS
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export async function signUpWithCognito(email: string, password: string) {
  try {
    const validatedData = signUpSchema.parse({ email, password });
    
    const response = await fetch('/api/auth/cognito-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
}

export async function signInWithCognito(email: string, password: string) {
  try {
    const validatedData = signInSchema.parse({ email, password });
    
    const response = await fetch('/api/auth/cognito-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Authentication failed');
    }

    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
}

export async function createGoogleUserInCognito(email: string, sub: string) {
  try {
    const response = await fetch('/api/auth/cognito-google-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, sub }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'User creation failed');
    }

    return result;
  } catch (error) {
    throw error;
  }
}