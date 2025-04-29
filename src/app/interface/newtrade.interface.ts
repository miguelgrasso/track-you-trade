export interface NewTrade{
    symbolId: number;
    operationTypeId: number;
    resultId: number;
    statusOperationId: number;
    strategyId?: number; // Estrategia asociada (opcional)
    quantity: number;
    dateEntry: string; // ISO-8601 DateTime string
    priceEntry: number;
    priceExit: number;
    spread: number;
}