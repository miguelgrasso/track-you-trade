import { z } from 'zod';

export const createTradeSchema = z.object({
  symbolId: z.number().int().positive('Symbol ID must be a positive integer'),
  operationTypeId: z.number().int().positive('Operation Type ID must be a positive integer'),
  resultId: z.number().int().positive('Result ID must be a positive integer'),
  statusOperationId: z.number().int().positive('Status Operation ID must be a positive integer'),
  quantity: z.number().positive('Quantity must be a positive number'),
  dateEntry: z.string().datetime('Invalid date format'),
  priceEntry: z.number().positive('Entry price must be a positive number'),
  priceExit: z.number().optional(),
  spread: z.number().min(0, 'Spread must be non-negative').optional(),
  strategyId: z.number().int().positive().optional(),
});

export const updateTradeSchema = createTradeSchema.partial();

export const tradeParamsSchema = z.object({
  id: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error('ID must be a positive integer');
    }
    return num;
  }),
});

export const tradeQuerySchema = z.object({
  page: z.string().transform((val) => Math.max(1, parseInt(val, 10) || 1)).optional(),
  limit: z.string().transform((val) => Math.min(100, Math.max(1, parseInt(val, 10) || 10))).optional(),
  symbolId: z.string().transform((val) => parseInt(val, 10)).optional(),
  strategyId: z.string().transform((val) => parseInt(val, 10)).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateTradeInput = z.infer<typeof createTradeSchema>;
export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;
export type TradeParams = z.infer<typeof tradeParamsSchema>;
export type TradeQuery = z.infer<typeof tradeQuerySchema>;