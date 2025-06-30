import { NewTrade } from "../interface/newtrade.interface";
import { createTradeSchema } from "@/lib/validations/trade.schema";
import { z } from "zod";

// Función helper para manejar errores de API
function handleApiError(error: unknown, defaultMessage: string): never {
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error(defaultMessage);
}

// Función helper para manejar timeouts
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

export async function getTrades(params?: {
  page?: number;
  limit?: number;
  symbolId?: number;
  strategyId?: number;
  startDate?: string;
  endDate?: string;
}) {
  try {
    // Construir URL con parámetros
    const url = new URL('/api/trades', window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await withTimeout(
      fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }),
      10000 // 10 segundos timeout
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    handleApiError(error, 'Failed to fetch trades');
  }
}

export async function createTrade(trade: NewTrade) {
  try {
    // Validar datos antes de enviar
    const validatedTrade = createTradeSchema.parse(trade);

    const response = await withTimeout(
      fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedTrade),
      }),
      15000 // 15 segundos timeout para escritura
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 400 && errorData.details) {
        // Error de validación con detalles
        const validationErrors = errorData.details
          .map((detail: any) => `${detail.field}: ${detail.message}`)
          .join(', ');
        throw new Error(`Validation failed: ${validationErrors}`);
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      throw new Error(`Validation failed: ${validationErrors}`);
    }
    handleApiError(error, 'Failed to create trade');
  }
}

export async function updateTrade(id: number, trade: Partial<NewTrade>) {
  try {
    const response = await withTimeout(
      fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trade),
      }),
      15000
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    handleApiError(error, 'Failed to update trade');
  }
}

export async function deleteTrade(id: number) {
  try {
    const response = await withTimeout(
      fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      10000
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.ok;
  } catch (error) {
    handleApiError(error, 'Failed to delete trade');
  }
}
